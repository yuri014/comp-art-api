import interactionsDefinitions from './interactions';
import mutations from './mutation';
import notificationsDefinitions from './notifications';
import { postDefinitions, postInputDefinitions } from './post';
import { productDefinition, productInputDefinition } from './product';
import {
  profileDefinitions,
  userAndProfileInputsDefinitions,
  userDefinitions,
} from './profileAndUser';
import queries from './query';
import subscriptions from './subscriptions';

const typeDefs = [
  interactionsDefinitions,
  profileDefinitions,
  userDefinitions,
  postDefinitions,
  productDefinition,
  productInputDefinition,
  userAndProfileInputsDefinitions,
  postInputDefinitions,
  notificationsDefinitions,
  queries,
  mutations,
  subscriptions,
];

export default typeDefs;
