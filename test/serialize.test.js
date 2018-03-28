const admin = require('firebase-admin')
const serviceAccount = require('../firebase_secret.json')
const test = require('ava')
const { FirestoreSimple } = require('../src/index.js')
const { deleteCollection } = require('./util')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const dao = new FirestoreSimple(db, 'test_serialize', {
  bookTitle: "book_title",
})
const existsDocId = 'test'
const existsDoc = {
  book_title: 'title',
}

test.before(async t => {
  // prepare serialized key document
  await dao.collectionRef.doc(existsDocId).set(existsDoc)
})

// Delete all documents. (= delete collection)
test.after.always(async t => {
  await deleteCollection(db, 'test_serialize')
})

test('fetchDocument with serialize mapping', async t => {
  const doc = await dao.fetchDocument(existsDocId)
  const expectDoc = {
    id: existsDocId,
    bookTitle: existsDoc.book_title,
  }

  t.deepEqual(doc, expectDoc)
})

test('add with serialize mapping', async t => {
  const title = 'add'
  const doc = {
    bookTitle: title,
  }
  const addedDoc = await dao.add(doc)

  const fetchedDoc = await dao.collectionRef.doc(addedDoc.id).get()
  t.deepEqual(fetchedDoc.data(), { book_title: title }, 'fetched object')
})

test('set with serialize mapping', async t => {
  const addedDoc = await dao.collectionRef.add({
    book_title: 'hogehoge',
  })
  const title = 'set'
  const setDoc = {
    id: addedDoc.id,
    bookTitle: title,
  }
  await dao.set(setDoc)

  const fetchedDoc = await dao.collectionRef.doc(addedDoc.id).get()
  t.deepEqual(fetchedDoc.data(), { book_title: title }, 'fetched object')
})