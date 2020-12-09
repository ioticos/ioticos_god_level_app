import Sidebar from './SideBar.vue';
import SidebarItem from './SidebarItem.vue';

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [],
  displaySidebar(value) {
    this.showSidebar = value;
  },
};

const SidebarPlugin = {
  install(Vue, options) {
    if (options && options.sidebarLinks) {
      SidebarStore.sidebarLinks = options.sidebarLinks;
    }
    let app = new Vue({
      data: {
        sidebarStore: SidebarStore
      }
    });
    Vue.prototype.$sidebar = app.sidebarStore;
    Vue.component('side-bar', Sidebar);
    Vue.component('sidebar-item', SidebarItem);
  }
};

export default SidebarPlugin;
