import interactionsDefinitions from './interactions';
import mutations from './mutation';
import { postDefinitions, postInputDefinitions } from './post';
import {
  profileDefinitions,
  userAndProfileInputsDefinitions,
  userDefinitions,
} from './profileAndUser';
import queries from './query';

const typeDefs = [
  interactionsDefinitions,
  profileDefinitions,
  userDefinitions,
  userAndProfileInputsDefinitions,
  postDefinitions,
  postInputDefinitions,
  queries,
  mutations,
];

export default typeDefs;
