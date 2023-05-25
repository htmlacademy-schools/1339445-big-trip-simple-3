import {createElement} from '../render.js';
import './abstract-view.css';

/** @const {string} Класс, реализующий эффект "покачивания головой" */
const SHAKE_CLASS_NAME = 'shake';

/** @const {number} Время анимации в миллисекундах */
const SHAKE_ANIMATION_TIMEOUT = 600;

/**
 * Абстрактный класс представления
 */
export default class AbstractView {
  /** @type {HTMLElement|null} Элемент представления */
  #element = null;

  /** @type {Object} Объект с колбэками. Может использоваться для хранения обработчиков событий */
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  /**
   * Геттер для получения элемента
   * @returns {HTMLElement} Элемент представления
   */
  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
      this.afterCreateElement();
    }

    return this.#element;
  }

  /** Callback при создании нового элемента */
  afterCreateElement() {
    // pass
  }

  /**
   * Геттер для получения разметки элемента
   * @abstract
   * @returns {string} Разметка элемента в виде строки
   */
  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  /** Метод для обнуления элемента */
  removeElement() {
    this.#element = null;
  }

  /** Метод для удаления View, в том числе и со страницы */
  delete() {
    if (this.isActive()) {
      this.#element.remove();
      this.removeElement();
    }
  }

  /** Проверка, что элемент существует и находится на странице */
  isActive() {
    return this.isElementExist() && this.#element.isConnected;
  }

  /** Проверка, что элемент существует */
  isElementExist() {
    return Boolean(this.#element);
  }

  /**
   * Метод, реализующий эффект "покачивания головой"
   * @param {shakeCallback} [callback] Функция, которая будет вызвана после завершения анимации
   */
  shake(callback) {
    this.element.classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      this.element.classList.remove(SHAKE_CLASS_NAME);
      callback?.();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

/**
 * Функция, которая будет вызвана методом shake после завершения анимации
 * @callback shakeCallback
 */
