import { List } from '@webui/metadata';


const list = () => new List.main.element('skillrateranges', ' Skill Rate Ranges');

const formset = () => {
  return {
    fields: [],
    list: new List.main.element('skillrateranges', 'Skill Rate Ranges').setColumns([]),
  }
}

export const skillrateranges = {
  list,
  formset,
}
