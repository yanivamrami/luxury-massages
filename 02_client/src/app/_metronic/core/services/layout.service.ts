import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { DefaultLayoutConfig } from '../../configs/default-layout.config';
import * as objectPath from 'object-path';

const LAYOUT_CONFIG_LOCAL_STORAGE_KEY = `${environment.appVersion}-layoutConfig`;
const ROOT_URL = window.location.protocol + '//' + window.location.hostname + ':3000/';
// const ROOT_URL = 'http://161.97.157.17:3000/';
// const ROOT_URL = 'http://localhost:3000/';
// const ROOT_URL = 'http://127.0.0.1:3000/';
// const ROOT_URL = 'http://' + window.location.hostname + ':3000/';


@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private layoutConfigSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    undefined
  );
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // scope list of css classes
  private classes = {
    header: [],
    header_container: [],
    header_mobile: [],
    header_menu: [],
    aside_menu: [],
    subheader: [],
    subheader_container: [],
    content: [],
    content_container: [],
    footer_container: [],
  };

  // scope list of html attributes
  private attrs = {
    aside_menu: {},
  };

  constructor() {}

  initConfig(): any {
    const configFromLocalStorage = localStorage.getItem(
      LAYOUT_CONFIG_LOCAL_STORAGE_KEY
    );
    if (configFromLocalStorage) {
      try {
        this.layoutConfigSubject.next(JSON.parse(configFromLocalStorage));
        return;
      } catch (error) {
        this.removeConfig();
        console.error('config parse from local storage', error);
      }
    }
    this.layoutConfigSubject.next(DefaultLayoutConfig);
  }

  private removeConfig() {
    localStorage.removeItem(LAYOUT_CONFIG_LOCAL_STORAGE_KEY);
  }

  refreshConfigToDefault() {
    this.setConfigWithPageRefresh(undefined);
  }

  getConfig(): any {
    const config = this.layoutConfigSubject.value;
    if (!config) {
      return DefaultLayoutConfig;
    }
    return config;
  }

  setConfig(config: any) {
    if (!config) {
      this.removeConfig();
    } else {
      localStorage.setItem(
        LAYOUT_CONFIG_LOCAL_STORAGE_KEY,
        JSON.stringify(config)
      );
    }
    this.layoutConfigSubject.next(config);
  }

  setConfigWithoutLocalStorageChanges(config: any) {
    this.layoutConfigSubject.next(config);
  }

  setConfigWithPageRefresh(config: any) {
    this.setConfig(config);
    document.location.reload();
  }

  getProp(path: string): any {
    return objectPath.get(this.layoutConfigSubject.value, path);
  }

  setCSSClass(path: string, classesInStr: string) {
    const cssClasses = this.classes[path];
    if (!cssClasses) {
      this.classes[path] = [];
    }
    classesInStr
      .split(' ')
      .forEach((cssClass: string) => this.classes[path].push(cssClass));
  }

  getCSSClasses(path: string): string[] {
    const cssClasses = this.classes[path];
    if (!cssClasses) {
      return [];
    }

    return cssClasses;
  }

  getStringCSSClasses(path: string) {
    return this.getCSSClasses(path).join(' ');
  }

  getCurrentRole() {
    if (JSON.parse(localStorage.getItem(this.authLocalStorageToken)))
      return JSON.parse(localStorage.getItem(this.authLocalStorageToken)).user.role;
    return 3
  }

  getHTMLAttributes(path: string): any {
    const attributesObj = this.attrs[path];
    if (!attributesObj) {
      return {};
    }
    return attributesObj;
  }

  setHTMLAttribute(path, attrKey: string, attrValue: any) {
    const attributesObj = this.attrs[path];
    if (!attributesObj) {
      this.attrs[path] = {};
    }
    this.attrs[path][attrKey] = attrValue;
  }
}