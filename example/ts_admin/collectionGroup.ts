import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccount from '../../firebase_secret.json' // your firebase secret json
import { FirestoreSimple } from '../../src'

const ROOT_PATH = 'example/ts_admin_collection_group'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
})
const firestore = admin.firestore()

interface Review {
  id: string,
  userId: string,
  text: string,
  created: Date,
}

const userNames = ['alice', 'bob', 'john']
const collectionId = 'review'

const main = async (): Promise<void> => {
  // Prepare review documents
  await firestore.collection(`${ROOT_PATH}/user/alice/${collectionId}`)
    .add({ userId: 'alice', text: 'aaa', created: admin.firestore.FieldValue.serverTimestamp() })
  await firestore.collection(`${ROOT_PATH}/user/bob/${collectionId}`)
    .add({ userId: 'bob', text: 'bbb', created: admin.firestore.FieldValue.serverTimestamp() })
  await firestore.collection(`${ROOT_PATH}/user/john/${collectionId}`)
    .add({ userId: 'john', text: 'ccc', created: admin.firestore.FieldValue.serverTimestamp() })

  // Create CollectionGroup dao
  const firestoreSimple = new FirestoreSimple(firestore)
  const reviewCollectionGroup = firestoreSimple.collectionGroup<Review>({
    collectionId: 'review',
    decode: (doc) => {
      return {
        id: doc.id,
        userId: doc.userId,
        text: doc.text,
        created: doc.created.toDate()
      }
    }
  })

  // Fetch CollectionGroup documents
  const reviews = await reviewCollectionGroup.fetch()
  console.dir(reviews)
  // [ { id: 'sElJjoIFDgjGy89izlnK',
  //   userId: 'alice',
  //   text: 'aaa',
  //   created: 2019-12-26T15:33:17.883Z },
  // { id: 'upM1SLLjkVTf8uWFuYPp',
  //   userId: 'bob',
  //   text: 'bbb',
  //   created: 2019-12-26T15:33:18.171Z },
  // { id: 'k7b4wBzGhzxjyXg8KmCK',
  //   userId: 'john',
  //   text: 'ccc',
  //   created: 2019-12-26T15:33:18.411Z } ]

  // Remove documents
  for (const user of userNames) {
    const userReivewDao = firestoreSimple.collection({ path: `${ROOT_PATH}/user/${user}/review` })
    const reviews = await userReivewDao.fetchAll()

    await userReivewDao.bulkDelete(reviews.map((review) => review.id))
  }
}
main()