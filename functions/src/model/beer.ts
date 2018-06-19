import * as Joi from 'joi';
import * as httpErrors from 'http-errors';
import db from './db-admin';
import { QueryDocumentSnapshot, DocumentData, Transaction } from '@google-cloud/firestore';

export interface BeerSchema {
  name: string;
  device?: object; // TODO delete property
}

export interface BeerTransaction {
  type: 'adjust-up' | 'adjust-down'; // should this be an enum?
  qty: number;
  id: string;
}

export interface BeerResponse {
  name: string;
  device: object;
  id: string;
  transactions: BeerTransaction[];
}

const beerSchema = Joi.object().keys({
  name: Joi.string().required(),
  device: Joi.object(),
});

const transactionSchema = Joi.object().keys({
  type: Joi.string()
    .valid(['adjust-up', 'adjust-down'])
    .required(),
  qty: Joi.number().required(),
});

const verifySchema = (schema: Joi.ObjectSchema) => (testObj: any) => Joi.validate(testObj, schema);
const verifyBeerSchema = verifySchema(beerSchema);
const verifyTransactionSchema = verifySchema(transactionSchema);

const mapIdToSnap = async (snap: FirebaseFirestore.QuerySnapshot): Promise<BeerResponse[]> => {
  let results: BeerResponse[] = [];
  snap.forEach(doc => {
    const data = <BeerResponse>doc.data();
    results.push({ id: doc.id, ...data });
  });
  return results;
};

const mapTransactionToBeer = async (beers: BeerResponse[]): Promise<BeerResponse[]> => {
  return await Promise.all(
    beers.map(async beer => {
      const transactions = await fetchTransactions(beer.id);
      return { ...beer, transactions };
    })
  );
};

const fetchTransactions = async (beerId: string = null): Promise<BeerTransaction[]> => {
  let transactions: BeerTransaction[] = [];
  await db
    .collection('beers')
    .doc(beerId)
    .collection('transactions')
    .get()
    .then(snap =>
      snap.forEach(doc => {
        const data = <BeerTransaction>doc.data();
        transactions.push({ id: doc.id, ...data });
      })
    );

  return transactions;
};

const save = async (beerData: BeerSchema): Promise<BeerResponse> => {
  const { error } = verifyBeerSchema(beerData);

  if (error) {
    return Promise.reject(new httpErrors.BadRequest(error.message));
  }

  return db
    .collection('beers')
    .add(beerData)
    .then(ref => findOne(ref.id));
};

const find = async (): Promise<BeerResponse[]> => {
  return db
    .collection('beers')
    .get()
    .then(mapIdToSnap)
    .then(mapTransactionToBeer);
};

const findOne = async (id: string): Promise<BeerResponse> => {
  const beer = await db
    .collection('beers')
    .doc(id)
    .get();

  if (!beer.exists) {
    return Promise.reject(new httpErrors.NotFound());
  }

  const transactions = await fetchTransactions(id);
  const data = <BeerResponse>beer.data();
  return { id: beer.id, ...data, transactions };
};

const findById = async id => {
  return findOne(id);
};

const findByIdAndUpdate = async (id: string, updateData: BeerSchema) => {
  //TODO -- should validate update data

  const beer = await db
    .collection('beers')
    .doc(id)
    .get();

  if (!beer.exists) {
    return Promise.reject(new httpErrors.NotFound());
  }

  return db
    .collection('beers')
    .doc(id)
    .update(updateData);
};

const remove = async (id: string) => {
  const beer = await db
    .collection('beers')
    .doc(id)
    .get();

  if (!beer.exists) {
    return Promise.reject(new httpErrors.NotFound());
  }

  return db
    .collection('beers')
    .doc(id)
    .delete();
};

const findOneAndUpdate = async (id: string, update: BeerSchema) => {
  return findByIdAndUpdate(id, update);
};

const addTransaction = async (beerId: string, transaction: BeerTransaction) => {
  const { error } = verifyTransactionSchema(transaction);

  if (error) {
    return Promise.reject(new httpErrors.BadRequest(error.message));
  }

  const beer = await db
    .collection('beers')
    .doc(beerId)
    .get();

  if (!beer.exists) {
    return Promise.reject(new httpErrors.NotFound());
  }

  return db
    .collection('beers')
    .doc(beerId)
    .collection('transactions')
    .add({ ...transaction, dateTime: Date.now() })
    .then(() => findOne(beerId));
};

const removeTransaction = async (beerId: string, transactionId: string) => {
  return db
    .collection('beers')
    .doc(beerId)
    .collection('transactions')
    .doc(transactionId)
    .delete();
};

const beerModel = {
  save,
  findOne,
  find,
  findByIdAndUpdate,
  remove,
  findById,
  findOneAndUpdate,
  addTransaction,
  removeTransaction,
};

export default beerModel;
