import { Endpoints, Purpose } from '@webui/data';
import { getPropValue } from '@webui/utilities';

export const activateSkill = function(res: any, config: { purpose?: Purpose }): { endpoint: string, data: any } {
  const { purpose } = config;
  const default_rate = getPropValue(res, 'default_rate');
  const price_list_default_rate = getPropValue(res, 'price_list_default_rate');

  const active = getPropValue(res, 'active');
  const canActivate = purpose === Purpose.Hire ? default_rate && price_list_default_rate : default_rate;
  const canDeactivate = purpose === Purpose.Hire ? !default_rate || !price_list_default_rate : !default_rate;

  if (!active) {
    if (canActivate) {
      return {
        endpoint: Endpoints.Skill,
        data: { active: true }
      }
    }
  } else {
    if (canDeactivate) {
      return {
        endpoint: Endpoints.Skill,
        data: { active: false }
      }
    }
  }
}

export const listUpdateActions = {
  [Endpoints.Skill]: [ activateSkill ]
};
