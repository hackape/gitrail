/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as browser from './browser'
import { Event as BaseEvent, Emitter } from './event'
import { toDisposer, Disposable, IDisposable } from './lifecycle'

export type EventHandler = HTMLElement | HTMLDocument | Window

export interface IDomEvent {
  <K extends keyof HTMLElementEventMap>(
    element: EventHandler,
    type: K,
    useCapture?: boolean
  ): BaseEvent<HTMLElementEventMap[K]>
  (element: EventHandler, type: string, useCapture?: boolean): BaseEvent<any>
}

export const domEvent: IDomEvent = (element: EventHandler, type: string, useCapture?: boolean) => {
  const fn = (e: Event) => emitter.fire(e)
  const emitter = new Emitter<Event>({
    onFirstListenerAdd: () => {
      element.addEventListener(type, fn, useCapture)
    },
    onLastListenerRemove: () => {
      element.removeEventListener(type, fn, useCapture)
    }
  })

  return (...args: any[]) => {
    // @ts-ignore
    const disposable = emitter.event(...args)
    return toDisposer(disposable)
  }
}

export interface CancellableEvent {
  preventDefault(): void
  stopPropagation(): void
}

export function stop<T extends CancellableEvent>(event: BaseEvent<T>): BaseEvent<T> {
  return BaseEvent.map(event, e => {
    e.preventDefault()
    e.stopPropagation()
    return e
  })
}

export const EventType = {
  // Mouse
  CLICK: 'click',
  DBLCLICK: 'dblclick',
  MOUSE_UP: 'mouseup',
  MOUSE_DOWN: 'mousedown',
  MOUSE_OVER: 'mouseover',
  MOUSE_MOVE: 'mousemove',
  MOUSE_OUT: 'mouseout',
  MOUSE_ENTER: 'mouseenter',
  MOUSE_LEAVE: 'mouseleave',
  CONTEXT_MENU: 'contextmenu',
  WHEEL: 'wheel',
  // Keyboard
  KEY_DOWN: 'keydown',
  KEY_PRESS: 'keypress',
  KEY_UP: 'keyup',
  // HTML Document
  LOAD: 'load',
  UNLOAD: 'unload',
  ABORT: 'abort',
  ERROR: 'error',
  RESIZE: 'resize',
  SCROLL: 'scroll',
  FULLSCREEN_CHANGE: 'fullscreenchange',
  WK_FULLSCREEN_CHANGE: 'webkitfullscreenchange',
  // Form
  SELECT: 'select',
  CHANGE: 'change',
  SUBMIT: 'submit',
  RESET: 'reset',
  FOCUS: 'focus',
  FOCUS_IN: 'focusin',
  FOCUS_OUT: 'focusout',
  BLUR: 'blur',
  INPUT: 'input',
  // Local Storage
  STORAGE: 'storage',
  // Drag
  DRAG_START: 'dragstart',
  DRAG: 'drag',
  DRAG_ENTER: 'dragenter',
  DRAG_LEAVE: 'dragleave',
  DRAG_OVER: 'dragover',
  DROP: 'drop',
  DRAG_END: 'dragend',
  // Animation
  ANIMATION_START: browser.isWebKit ? 'webkitAnimationStart' : 'animationstart',
  ANIMATION_END: browser.isWebKit ? 'webkitAnimationEnd' : 'animationend',
  ANIMATION_ITERATION: browser.isWebKit ? 'webkitAnimationIteration' : 'animationiteration'
} as const

export interface EventLike {
  preventDefault(): void
  stopPropagation(): void
}

export const EventHelper = {
  stop: function(e: EventLike, cancelBubble?: boolean) {
    if (e.preventDefault) {
      e.preventDefault()
    } else {
      // IE8
      ;(<any>e).returnValue = false
    }

    if (cancelBubble) {
      if (e.stopPropagation) {
        e.stopPropagation()
      } else {
        // IE8
        ;(<any>e).cancelBubble = true
      }
    }
  }
}

export interface IFocusTracker extends Disposable {
  onDidFocus: BaseEvent<void>
  onDidBlur: BaseEvent<void>
}

class FocusTracker extends Disposable implements IFocusTracker {
  private readonly _onDidFocus = this._register(new Emitter<void>())
  public readonly onDidFocus: BaseEvent<void> = this._onDidFocus.event

  private readonly _onDidBlur = this._register(new Emitter<void>())
  public readonly onDidBlur: BaseEvent<void> = this._onDidBlur.event

  constructor(element: HTMLElement | Window) {
    super()
    let hasFocus = isAncestor(document.activeElement, <HTMLElement>element)
    let loosingFocus = false

    const onFocus = () => {
      loosingFocus = false
      if (!hasFocus) {
        hasFocus = true
        this._onDidFocus.fire()
      }
    }

    const onBlur = () => {
      if (hasFocus) {
        loosingFocus = true
        window.setTimeout(() => {
          if (loosingFocus) {
            loosingFocus = false
            hasFocus = false
            this._onDidBlur.fire()
          }
        }, 0)
      }
    }

    this._register(domEvent(element, EventType.FOCUS, true)(onFocus))
    this._register(domEvent(element, EventType.BLUR, true)(onBlur))
  }
}

export function trackFocus(element: HTMLElement | Window): IFocusTracker {
  return new FocusTracker(element)
}

export function isAncestor(testChild: Node | null, testAncestor: Node | null): boolean {
  while (testChild) {
    if (testChild === testAncestor) {
      return true
    }
    testChild = testChild.parentNode
  }

  return false
}


class DomListener implements IDisposable {

	private _handler: (e: any) => void;
	private _node: Element | Window | Document;
	private readonly _type: string;
	private readonly _useCapture: boolean;

	constructor(node: Element | Window | Document, type: string, handler: (e: any) => void, useCapture?: boolean) {
		this._node = node;
		this._type = type;
		this._handler = handler;
		this._useCapture = (useCapture || false);
		this._node.addEventListener(this._type, this._handler, this._useCapture);
	}

	public dispose(): void {
		if (!this._handler) {
			// Already disposed
			return;
		}

		this._node.removeEventListener(this._type, this._handler, this._useCapture);

		// Prevent leakers from holding on to the dom or handler func
		this._node = null!;
		this._handler = null!;
	}
}

export function addDisposableListener<K extends keyof GlobalEventHandlersEventMap>(node: Element | Window | Document, type: K, handler: (event: GlobalEventHandlersEventMap[K]) => void, useCapture?: boolean): IDisposable;
export function addDisposableListener(node: Element | Window | Document, type: string, handler: (event: any) => void, useCapture?: boolean): IDisposable;
export function addDisposableListener(node: Element | Window | Document, type: string, handler: (event: any) => void, useCapture?: boolean): IDisposable {
	return new DomListener(node, type, handler, useCapture);
}
