import Ads from './Ads';
import IFrame from './IFrame';
import { waitForOverwolf } from './lib/overwolf';

waitForOverwolf().then(async () => {
  IFrame();
  Ads();
});
