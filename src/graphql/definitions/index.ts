import interactionsDefinitions from './interactions';
import mutations from './mutation';
import { postDefinitions, postInputDefinitions } from './post';
import { productDefinition, productInputDefinition } from './product';
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
  postDefinitions,
  productDefinition,
  productInputDefinition,
  userAndProfileInputsDefinitions,
  postInputDefinitions,
  queries,
  mutations,
];

export default typeDefs;
