import {
  createOverlayBasicComponent,
  initOverlayByIdToggler,
} from '../hocs/index.mjs';

const SidebarBasic = createOverlayBasicComponent({
  BASIC_CLASS_NAME: 'ms-sidebar',
  cnBuilderProps: [
    {
      propKey: 'align',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'right',
    },
    { propKey: 'position', options: ['absolute', 'fixed', 'static', 'sticky'] },
    // { propKey: 'isDimmed', modifier: 'dimmed', options: [true, false] },
  ],
});

SidebarBasic.Actions = {
  initSidebarByIdToggler: initOverlayByIdToggler,
};

export { SidebarBasic };
