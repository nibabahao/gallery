'use strict';

describe('GalleryApp', () => {
  let React = require('react/addons');
  let GalleryApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    GalleryApp = require('components/GalleryApp.js');
    component = React.createElement(GalleryApp);
  });

  it('should create a new instance of GalleryApp', () => {
    expect(component).toBeDefined();
  });
});
