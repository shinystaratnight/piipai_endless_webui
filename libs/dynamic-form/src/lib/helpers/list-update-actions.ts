import { Endpoints, Purpose } from '@webui/data';

export const activateSkill = function(res, config) {
  const { purpose } = config;
  const { default_rate, price_list_default_rate, active } = res;

  const canActivate = purpose === Purpose.Hire ? default_rate && price_list_default_rate : default_rate && default_rate !== '0';
  const canDeactivate = purpose === Purpose.Hire ? !default_rate || !price_list_default_rate : !default_rate || default_rate === '0';

  if (!active && canActivate) {
    return {
      active: true
    }
  }

  if (active && canDeactivate) {
    return {
      active: false
    }
  }

  return {
    active
  }
}

export const listUpdateActions = {
  [Endpoints.SkillName]: [ activateSkill ]
};
