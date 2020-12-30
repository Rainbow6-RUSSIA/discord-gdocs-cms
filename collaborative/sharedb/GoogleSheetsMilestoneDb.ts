// import { MilestoneDB } from "sharedb";

// export class GoogleSheetsMilestoneDB extends MilestoneDB {
//     constructor(mongo, options) {
//         if (typeof mongo === "object") {
//           options = mongo;
//           mongo = options.mongo;
//         }
    
//         // Shallow clone because we delete options later on
//         options = MongoMilestoneDB._shallowClone(options) || {};
//         super(options);
    
//         this.interval = this.interval || 1000;
    
//         this._disableIndexCreation = options.disableIndexCreation;
//         this._milestoneIndexes = new Set();
    
//         // Since we pass our options object straight through to Mongo, we need to remove any non-Mongo
//         // options, because these throw warnings, or can even break the connection if setting the
//         // validateOptions flag.
//         // See: https://github.com/mongodb/node-mongodb-native/blob/bd4fb531a7f599bb6cf50ebbab3b986f191a7ef8/lib/mongo_client.js#L53-L57
//         delete options.mongo;
//         delete options.interval;
//         delete options.disableIndexCreation;
//         this._mongoPromise = MongoMilestoneDB._connect(mongo, options);
//       }


//     saveMilestoneSnapshot(collectionName, snapshot, callback) {
//     if (!callback) {
//         callback = (error) => {
//         if (error) {
//             this.emit("error", error);
//         } else {
//             this.emit("save", collectionName, snapshot);
//         }
//         };
//     }

//     if (!collectionName) return process.nextTick(callback, new InvalidCollectionNameError());
//     if (!snapshot) return process.nextTick(callback, new InvalidSnapshotError());

//     this._saveMilestoneSnapshot(collectionName, snapshot)
//         .then(() => {
//         process.nextTick(callback, null);
//         })
//         .catch(error => process.nextTick(callback, error));
//     }

//     getMilestoneSnapshot(collectionName, id, version, callback) {
//     this._getMilestoneSnapshotByVersion(collectionName, id, version)
//         .then(snapshot => process.nextTick(callback, null, snapshot))
//         .catch(error => process.nextTick(callback, error));
//     }

//     getMilestoneSnapshotAtOrBeforeTime(collection, id, timestamp, callback) {
//     const isAfterTimestamp = false;
//     this._getMilestoneSnapshotByTimestamp(collection, id, timestamp, isAfterTimestamp)
//         .then(snapshot => process.nextTick(callback, null, snapshot))
//         .catch(error => process.nextTick(callback, error));
//     }

//     getMilestoneSnapshotAtOrAfterTime(collection, id, timestamp, callback) {
//     const isAfterTimestamp = true;
//     this._getMilestoneSnapshotByTimestamp(collection, id, timestamp, isAfterTimestamp)
//         .then(snapshot => process.nextTick(callback, null, snapshot))
//         .catch(error => process.nextTick(callback, error));
//     }
// }

export {}