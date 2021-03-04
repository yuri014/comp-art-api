import interactionsDefinitions from './interactions';
import { postDefinitions, postInputDefinitions } from './post';
import {
  profileDefinitions,
  userAndProfileInputsDefinitions,
  userDefinitions,
} from './profileAndUser';
import { mutations, queries } from './typeDefs';

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
