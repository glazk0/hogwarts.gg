import Ads from './Ads';
import IFrame from './IFrame';
import { communicate } from './lib/messages';
import { waitForOverwolf } from './lib/overwolf';
import LoadingContainer from './LoadingContainer';

waitForOverwolf().then(async () => {
  const loadingContainer = LoadingContainer();

  const iframe = IFrame();
  const ads = Ads();

  document.body.append(loadingContainer, iframe, ads);

  communicate(iframe, () => {
    loadingContainer.remove();
  });
});
