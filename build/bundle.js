
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.46.4 */

    function create_fragment$f(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.46.4 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.46.4 */
    const file$d = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$d(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$d, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Home.svelte generated by Svelte v3.46.4 */

    const file$c = "src\\routes\\Home.svelte";

    function create_fragment$c(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Home";
    			add_location(h1, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\routes\About.svelte generated by Svelte v3.46.4 */

    const file$b = "src\\routes\\About.svelte";

    function create_fragment$b(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "About";
    			add_location(h1, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\routes\Login.svelte generated by Svelte v3.46.4 */

    const { console: console_1$2 } = globals;
    const file$a = "src\\routes\\Login.svelte";

    function create_fragment$a(ctx) {
    	let main;
    	let article;
    	let h1;
    	let t1;
    	let form;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			article = element("article");
    			h1 = element("h1");
    			h1.textContent = "Login";
    			t1 = space();
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Email";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			label1 = element("label");
    			label1.textContent = "Password";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			button = element("button");
    			button.textContent = "Login";
    			attr_dev(h1, "class", "svelte-1kpt7hq");
    			add_location(h1, file$a, 11, 4, 168);
    			attr_dev(label0, "for", "email");
    			add_location(label0, file$a, 13, 6, 227);
    			attr_dev(input0, "id", "email");
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "name", "email");
    			input0.required = true;
    			add_location(input0, file$a, 14, 6, 267);
    			attr_dev(label1, "for", "password");
    			add_location(label1, file$a, 16, 6, 351);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "name", "password");
    			input1.required = true;
    			add_location(input1, file$a, 17, 6, 397);
    			attr_dev(button, "type", "submit");
    			add_location(button, file$a, 25, 6, 545);
    			add_location(form, file$a, 12, 4, 188);
    			attr_dev(article, "class", "login-box svelte-1kpt7hq");
    			add_location(article, file$a, 10, 2, 135);
    			attr_dev(main, "class", "svelte-1kpt7hq");
    			add_location(main, file$a, 9, 0, 125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, article);
    			append_dev(article, h1);
    			append_dev(article, t1);
    			append_dev(article, form);
    			append_dev(form, label0);
    			append_dev(form, t3);
    			append_dev(form, input0);
    			set_input_value(input0, /*email*/ ctx[0]);
    			append_dev(form, t4);
    			append_dev(form, label1);
    			append_dev(form, t6);
    			append_dev(form, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(form, t7);
    			append_dev(form, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(button, "click", /*handleSubmit*/ ctx[2], false, false, false),
    					listen_dev(form, "submit", /*handleSubmit*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*email*/ 1 && input0.value !== /*email*/ ctx[0]) {
    				set_input_value(input0, /*email*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let email;
    	let password;

    	const handleSubmit = event => {
    		console.log("toto");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		email = this.value;
    		$$invalidate(0, email);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({ email, password, handleSubmit });

    	$$self.$inject_state = $$props => {
    		if ('email' in $$props) $$invalidate(0, email = $$props.email);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [email, password, handleSubmit, input0_input_handler, input1_input_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /** Dispatch event on click outside of node */
    function clickOutside(node) {
      const handleClick = (event) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
          node.dispatchEvent(new CustomEvent("clickOutside", node));
        }
      };

      document.addEventListener("click", handleClick, true);

      return {
        destroy() {
          document.removeEventListener("click", handleClick, true);
        },
      };
    }

    /* src\components\Dialog.svelte generated by Svelte v3.46.4 */
    const file$9 = "src\\components\\Dialog.svelte";
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({ class: "slot" });
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    function create_fragment$9(ctx) {
    	let dialog;
    	let article;
    	let a;
    	let t0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const title_slot_template = /*#slots*/ ctx[2].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[1], get_title_slot_context);
    	const content_slot_template = /*#slots*/ ctx[2].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[1], get_content_slot_context);

    	const block = {
    		c: function create() {
    			dialog = element("dialog");
    			article = element("article");
    			a = element("a");
    			t0 = space();
    			if (title_slot) title_slot.c();
    			t1 = space();
    			if (content_slot) content_slot.c();
    			attr_dev(a, "href", "#close");
    			attr_dev(a, "aria-label", "Close");
    			attr_dev(a, "class", "close");
    			attr_dev(a, "data-target", "modal");
    			add_location(a, file$9, 13, 4, 376);
    			attr_dev(article, "class", "modal-content svelte-b6dbhk");
    			add_location(article, file$9, 12, 2, 292);
    			dialog.open = true;
    			attr_dev(dialog, "class", "modal");
    			add_location(dialog, file$9, 11, 0, 261);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dialog, anchor);
    			append_dev(dialog, article);
    			append_dev(article, a);
    			append_dev(article, t0);

    			if (title_slot) {
    				title_slot.m(article, null);
    			}

    			append_dev(article, t1);

    			if (content_slot) {
    				content_slot.m(article, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*closeDialog*/ ctx[0], false, false, false),
    					action_destroyer(clickOutside.call(null, article)),
    					listen_dev(article, "clickOutside", /*closeDialog*/ ctx[0], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[1], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			}

    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[1], dirty, get_content_slot_changes),
    						get_content_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot, local);
    			transition_in(content_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot, local);
    			transition_out(content_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dialog);
    			if (title_slot) title_slot.d(detaching);
    			if (content_slot) content_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dialog', slots, ['title','content']);
    	const dispatch = createEventDispatcher();

    	const closeDialog = () => {
    		dispatch("closeDialog");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dialog> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		clickOutside,
    		dispatch,
    		closeDialog
    	});

    	return [closeDialog, $$scope, slots];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\LegSelector.svelte generated by Svelte v3.46.4 */
    const file$8 = "src\\components\\LegSelector.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (34:4) {#each [...Array(numberOfLegs).keys()] as leg}
    function create_each_block$4(ctx) {
    	let option;
    	let t_value = /*leg*/ ctx[7] + 1 + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*leg*/ ctx[7] + 1;
    			option.value = option.__value;
    			add_location(option, file$8, 34, 6, 1247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*numberOfLegs*/ 2 && t_value !== (t_value = /*leg*/ ctx[7] + 1 + "")) set_data_dev(t, t_value);

    			if (dirty & /*numberOfLegs*/ 2 && option_value_value !== (option_value_value = /*leg*/ ctx[7] + 1)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(34:4) {#each [...Array(numberOfLegs).keys()] as leg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let button0;
    	let svg0;
    	let path0;
    	let t0;
    	let select;
    	let t1;
    	let button1;
    	let svg1;
    	let path1;
    	let mounted;
    	let dispose;
    	let each_value = [...Array(/*numberOfLegs*/ ctx[1]).keys()];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z");
    			add_location(path0, file$8, 26, 175, 849);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 320 512");
    			attr_dev(svg0, "class", "svelte-18fpq70");
    			add_location(svg0, file$8, 25, 5, 611);
    			attr_dev(button0, "class", "svelte-18fpq70");
    			add_location(button0, file$8, 24, 2, 564);
    			attr_dev(select, "class", "svelte-18fpq70");
    			if (/*selectedLeg*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[5].call(select));
    			add_location(select, file$8, 32, 2, 1127);
    			attr_dev(path1, "d", "M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z");
    			add_location(path1, file$8, 40, 175, 1602);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 320 512");
    			attr_dev(svg1, "class", "svelte-18fpq70");
    			add_location(svg1, file$8, 39, 5, 1364);
    			attr_dev(button1, "class", "svelte-18fpq70");
    			add_location(button1, file$8, 38, 2, 1321);
    			attr_dev(div, "class", "control-bar svelte-18fpq70");
    			add_location(div, file$8, 23, 0, 535);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div, t0);
    			append_dev(div, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*selectedLeg*/ ctx[0]);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handlePreviousControl*/ ctx[3], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[5]),
    					listen_dev(select, "change", /*dispatchChange*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*handleNextControl*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Array, numberOfLegs*/ 2) {
    				each_value = [...Array(/*numberOfLegs*/ ctx[1]).keys()];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selectedLeg, Array, numberOfLegs*/ 3) {
    				select_option(select, /*selectedLeg*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LegSelector', slots, []);
    	let { selectedLeg } = $$props;
    	let { numberOfLegs } = $$props;
    	const dispatch = createEventDispatcher();

    	function dispatchChange() {
    		dispatch("legChange");
    	}

    	const handlePreviousControl = () => {
    		$$invalidate(0, selectedLeg = selectedLeg !== 1 ? selectedLeg - 1 : selectedLeg);
    		dispatchChange();
    	};

    	const handleNextControl = () => {
    		$$invalidate(0, selectedLeg = selectedLeg !== numberOfLegs
    		? selectedLeg + 1
    		: selectedLeg);

    		dispatchChange();
    	};

    	const writable_props = ['selectedLeg', 'numberOfLegs'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LegSelector> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		selectedLeg = select_value(this);
    		$$invalidate(0, selectedLeg);
    		$$invalidate(1, numberOfLegs);
    	}

    	$$self.$$set = $$props => {
    		if ('selectedLeg' in $$props) $$invalidate(0, selectedLeg = $$props.selectedLeg);
    		if ('numberOfLegs' in $$props) $$invalidate(1, numberOfLegs = $$props.numberOfLegs);
    	};

    	$$self.$capture_state = () => ({
    		selectedLeg,
    		numberOfLegs,
    		createEventDispatcher,
    		dispatch,
    		dispatchChange,
    		handlePreviousControl,
    		handleNextControl
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectedLeg' in $$props) $$invalidate(0, selectedLeg = $$props.selectedLeg);
    		if ('numberOfLegs' in $$props) $$invalidate(1, numberOfLegs = $$props.numberOfLegs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selectedLeg,
    		numberOfLegs,
    		dispatchChange,
    		handlePreviousControl,
    		handleNextControl,
    		select_change_handler
    	];
    }

    class LegSelector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { selectedLeg: 0, numberOfLegs: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LegSelector",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*selectedLeg*/ ctx[0] === undefined && !('selectedLeg' in props)) {
    			console.warn("<LegSelector> was created without expected prop 'selectedLeg'");
    		}

    		if (/*numberOfLegs*/ ctx[1] === undefined && !('numberOfLegs' in props)) {
    			console.warn("<LegSelector> was created without expected prop 'numberOfLegs'");
    		}
    	}

    	get selectedLeg() {
    		throw new Error("<LegSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedLeg(value) {
    		throw new Error("<LegSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numberOfLegs() {
    		throw new Error("<LegSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberOfLegs(value) {
    		throw new Error("<LegSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const MISTAKE_DETECTION_RATIO = 1.2;
    class IOFXMLParser {
        constructor(splitsXmlDoc, className, mistakeDetectionRatio = MISTAKE_DETECTION_RATIO, timeZone, timeOffset, date) {
            this.course = [];
            this.runners = [];
            this.leader = [];
            this.superman = [];
            this.supermanSplits = [];
            this.mistakesSum = [];
            this.timeOffset = 0;
            this.routeChoicesStatistics = [];
            this.splitsXmlDoc = splitsXmlDoc;
            this.className = className;
            this.mistakeDetectionRatio = mistakeDetectionRatio;
            this.date = date;
            this.timeZone = timeZone;
            this.timeOffset = timeOffset;
            this.loadSplits();
        }
        computeRoutechoicesStatistics() {
            this.course.forEach((leg, legIndex) => {
                const legStatistics = {};
                // Make an array with splits and id for one leg
                const legSplits = this.runners
                    .map((runner) => {
                    const lg = runner.legs[legIndex];
                    return { id: runner.id, time: lg.time, routeChoice: lg.routeChoice };
                })
                    .filter((runner) => runner.routeChoice);
                legSplits.sort((a, b) => this.sortRunners(a, b));
                if (legSplits.length !== 0) {
                    Math.round(legSplits.length / 4) - 1;
                    legSplits.forEach((runner, runnerIndex) => {
                        var _a, _b;
                        legStatistics[runner.routeChoice.name] = (_a = legStatistics[runner.routeChoice.name]) !== null && _a !== void 0 ? _a : { numberOfRunners: 0 };
                        legStatistics[runner.routeChoice.name].fastestTime =
                            (_b = legStatistics[runner.routeChoice.name].fastestTime) !== null && _b !== void 0 ? _b : runner.time;
                        // legStatistics[runner.routeChoice.name].firstQuartileTime =
                        //   runnerIndex === firstQuartileIndex
                        //     ? runner.time
                        //     : legStatistics[runner.routeChoice.name].firstQuartileTime;
                        legStatistics[runner.routeChoice.name].numberOfRunners += 1;
                        legStatistics[runner.routeChoice.name].color =
                            runner.routeChoice.color;
                    });
                }
                this.routeChoicesStatistics.push(legStatistics);
            });
            console.log(this.routeChoicesStatistics);
        }
        loadSplits() {
            this.loadSplitsFromXml();
            this.checkIfCourseIsComplete();
            this.calculateRanks();
            this.calculateSplitTimes();
            this.calculateSplitRanksAndTimeBehind();
            this.calculateOverallRanks();
            this.calculateMistakes();
        }
        loadSplitsFromXml() {
            const classResults = Array.from(this.splitsXmlDoc.querySelectorAll("ClassResult"));
            const IOFXMLVersion = this.splitsXmlDoc
                .querySelector("ResultList")
                .getAttribute("iofVersion");
            // Find classResult by className
            const classResult = classResults.filter((classR) => {
                const name = IOFXMLVersion === "3.0"
                    ? classR.querySelector("Class Name").innerHTML
                    : classR.querySelector("ClassShortName").innerHTML;
                return name === this.className;
            });
            const personResults = classResult[0].querySelectorAll("PersonResult");
            personResults.forEach((personResult, index) => {
                const id = index + 1;
                const familyName = personResult.querySelector("Family")
                    ? personResult.querySelector("Family").innerHTML
                    : "";
                const firstName = personResult.querySelector("Given").innerHTML;
                let time = null;
                let startTime = null;
                let status = null;
                if (personResult.querySelector("StartTime")) {
                    if (IOFXMLVersion === "3.0") {
                        startTime = personResult
                            .querySelector("StartTime")
                            .innerHTML.includes("+")
                            ? personResult.querySelector("StartTime").innerHTML
                            : personResult.querySelector("StartTime").innerHTML + this.timeZone;
                        status = personResult.querySelector("Status").innerHTML;
                        if (status) {
                            time = Number(personResult.querySelector("Time").innerHTML);
                        }
                    }
                    else {
                        startTime =
                            this.date +
                                "T" +
                                personResult.querySelector("StartTime").innerHTML +
                                this.timeZone;
                        status = personResult
                            .querySelector("CompetitorStatus")
                            .getAttribute("value");
                        if (status) {
                            time = this.timeToSeconds(personResult.querySelector("Time").innerHTML); // TODO
                        }
                    }
                }
                const runnerCourse = Array.from(personResult.querySelectorAll("ControlCode")).map((controlCode) => Number(controlCode.innerHTML));
                const legs = Array.from(personResult.querySelectorAll("SplitTime")).map((splitTime) => {
                    const controlCode = Number(splitTime.querySelector("ControlCode").innerHTML);
                    const t = splitTime.querySelector("Time");
                    let timeOverall;
                    if (t) {
                        if (IOFXMLVersion === "3.0") {
                            timeOverall = Number(t.innerHTML);
                        }
                        else {
                            timeOverall = this.timeToSeconds(t.innerHTML);
                        }
                    }
                    else {
                        timeOverall = null;
                    }
                    return { controlCode: controlCode, timeOverall: timeOverall };
                });
                // Add split for finish
                legs.push({ controlCode: 999, timeOverall: time });
                runnerCourse.push(999);
                this.runners.push({
                    id: id,
                    course: runnerCourse,
                    status: status,
                    firstName: firstName,
                    lastName: familyName,
                    startTime: startTime,
                    time: time,
                    legs: legs,
                    timeBehindSupermanGraphData: [],
                    timeBehindLeaderGraphData: [],
                });
            });
            // Set reference course to first runner's course
            this.course = this.runners[0].course;
        }
        checkIfCourseIsComplete() {
            // Check if there is a SplitTime tag for every controls
            // Possible that there is no Time attached though
            this.runners.forEach((runner) => {
                if (this.arrayEquals(runner.course, this.course)) {
                    runner.isComplete = true;
                }
                else {
                    runner.isComplete = false;
                }
            });
            // For now only complete courses are keeped
            this.runners = this.runners.filter((runner) => runner.isComplete === true);
        }
        calculateRanks() {
            this.runners.sort((a, b) => this.sortRunners(a, b));
            const splitsLength = this.runners.length;
            const bestTime = this.runners[0].time;
            for (let i = 0; i < splitsLength; i++) {
                if (i > 0 && this.runners[i].time !== null) {
                    if (this.runners[i].time === this.runners[i - 1].time) {
                        this.runners[i].rank = this.runners[i - 1].rank;
                    }
                    else {
                        this.runners[i].rank = i + 1;
                    }
                    this.runners[i].timeBehind = this.runners[i].time - bestTime;
                }
                else if (this.runners[i].time !== null) {
                    this.runners[i].rank = i + 1;
                    this.runners[i].timeBehind = this.runners[i].time - bestTime;
                }
            }
        }
        calculateSplitTimes() {
            this.runners.forEach((runner) => {
                runner.legs.forEach((leg, index) => {
                    if (index === 0) {
                        if (leg.timeOverall === null) {
                            leg.time = null;
                        }
                        else {
                            leg.time = leg.timeOverall;
                        }
                    }
                    else {
                        if (leg.timeOverall === null) {
                            leg.time = null;
                        }
                        else if (runner.legs[index - 1].timeOverall === null) {
                            leg.time = null;
                        }
                        else {
                            leg.time = leg.timeOverall - runner.legs[index - 1].timeOverall;
                        }
                    }
                });
            });
        }
        calculateSplitRanksAndTimeBehind() {
            // For every legs of every runners calculate ranking and time behind
            this.course.forEach((leg, index) => {
                // Make an array with splits and id for one leg
                const legSplits = this.runners.map((runner) => {
                    const lg = runner.legs.find((l) => l.controlCode === leg);
                    return { id: runner.id, time: lg.time };
                });
                legSplits.sort((a, b) => this.sortRunners(a, b));
                // Populate the superman array
                if (index === 0) {
                    this.superman.push(legSplits[0].time);
                }
                else {
                    this.superman.push(this.superman[index - 1] + legSplits[0].time);
                }
                this.supermanSplits.push(legSplits[0].time);
                legSplits.forEach((legSplit, i) => {
                    //manage equal ranks
                    if (i > 0) {
                        if (legSplit.time === legSplits[i - 1].time) {
                            legSplit.rankSplit = legSplits[i - 1].rankSplit;
                        }
                        else {
                            legSplit.rankSplit = i + 1;
                        }
                    }
                    else {
                        legSplit.rankSplit = i + 1;
                    }
                    const runnerIndex = this.runners.findIndex((r) => legSplit.id === r.id);
                    this.runners[runnerIndex].legs[index].rankSplit = legSplit.rankSplit;
                    if (this.runners[runnerIndex].legs[index].time === null) {
                        this.runners[runnerIndex].legs[index].timeBehindSplit = null;
                    }
                    else {
                        this.runners[runnerIndex].legs[index].timeBehindSplit =
                            this.runners[runnerIndex].legs[index].time - legSplits[0].time;
                    }
                });
            });
        }
        calculateOverallRanks() {
            // For every legs of every runners calculate ranking and time behind
            this.course.forEach((leg, index) => {
                // Make an array with overall times and id for one leg
                const legOverallTimes = this.runners.map((runner) => {
                    const lg = runner.legs.find((l) => l.controlCode === leg);
                    return { id: runner.id, time: lg.timeOverall };
                });
                legOverallTimes.sort((a, b) => this.sortRunners(a, b));
                this.leader.push(legOverallTimes[0].time);
                legOverallTimes.forEach((legOverallTime, i) => {
                    //manage equal ranks
                    if (i > 0) {
                        if (legOverallTime.time === legOverallTimes[i - 1].time) {
                            legOverallTime.rankSplit = legOverallTimes[i - 1].rankSplit;
                        }
                        else {
                            legOverallTime.rankSplit = i + 1;
                        }
                    }
                    else {
                        legOverallTime.rankSplit = i + 1;
                    }
                    const runnerIndex = this.runners.findIndex((r) => legOverallTime.id === r.id);
                    this.runners[runnerIndex].legs[index].rankOverall =
                        legOverallTime.rankSplit;
                    if (this.runners[runnerIndex].legs[index].timeOverall === null) {
                        this.runners[runnerIndex].legs[index].timeBehindOverall = null;
                        this.runners[runnerIndex].legs[index].timeBehindSuperman = null;
                    }
                    else {
                        this.runners[runnerIndex].legs[index].timeBehindOverall =
                            this.runners[runnerIndex].legs[index].timeOverall -
                                legOverallTimes[0].time;
                        this.runners[runnerIndex].legs[index].timeBehindSuperman =
                            this.runners[runnerIndex].legs[index].timeOverall -
                                this.superman[index];
                    }
                });
            });
        }
        calculateMistakes() {
            // Initialize mistakesSum array for mistake graph
            this.mistakesSum = new Array(this.course.length).fill(0);
            this.runners.forEach((runner) => {
                if (runner.status === "OK") {
                    const percentageBehindSuperman = runner.legs.map((leg, legIndex) => {
                        return leg.time / this.supermanSplits[legIndex];
                    });
                    const averagePercentage = this.arrayAverage(percentageBehindSuperman);
                    let clearedPercentageBehindSuperman = [];
                    percentageBehindSuperman.forEach((leg, legIndex) => {
                        if (leg > averagePercentage * this.mistakeDetectionRatio) {
                            runner.legs[legIndex].isMistake = true;
                        }
                        else {
                            runner.legs[legIndex].isMistake = false;
                            clearedPercentageBehindSuperman.push(leg);
                        }
                        // Make dataset for "Time behind superman"
                        runner.timeBehindSupermanGraphData.push({
                            x: this.superman[legIndex],
                            y: runner.legs[legIndex].timeBehindSuperman,
                        });
                        // Make dataset for "Time behind leader"
                        runner.timeBehindLeaderGraphData.push({
                            x: this.leader[legIndex],
                            y: runner.legs[legIndex].timeBehindOverall,
                        });
                    });
                    // Recalculate average without mistakes
                    let clearedAveragePercentage = this.arrayAverage(clearedPercentageBehindSuperman);
                    // New pass to be sure to get all mistakes
                    clearedPercentageBehindSuperman = [];
                    percentageBehindSuperman.forEach((leg, legIndex) => {
                        if (leg > clearedAveragePercentage * this.mistakeDetectionRatio) {
                            runner.legs[legIndex].isMistake = true;
                            this.mistakesSum[legIndex]++;
                        }
                        else {
                            runner.legs[legIndex].isMistake = false;
                            clearedPercentageBehindSuperman.push(leg);
                        }
                    });
                    // Recalculate average without mistakes
                    clearedAveragePercentage = this.arrayAverage(clearedPercentageBehindSuperman);
                    let totalTimeLost = 0;
                    runner.legs.forEach((leg, legIndex) => {
                        if (leg.isMistake) {
                            leg.timeWithoutMistake = Math.round(this.supermanSplits[legIndex] * clearedAveragePercentage);
                            leg.timeLost = leg.time - leg.timeWithoutMistake;
                            totalTimeLost = totalTimeLost + leg.timeLost;
                        }
                    });
                    runner.totalTimeLost = totalTimeLost;
                }
            });
        }
        // Utils
        sortRunners(a, b) {
            if (a.time !== null && b.time !== null) {
                return a.time - b.time;
            }
            else if (a.time === null && b.time !== null) {
                return 1;
            }
            else if (a.time !== null && b.time === null) {
                return -1;
            }
            else {
                return 0;
            }
        }
        arrayEquals(a, b) {
            return (Array.isArray(a) &&
                Array.isArray(b) &&
                a.length === b.length &&
                a.every((val, index) => val === b[index]));
        }
        arrayAverage(a) {
            const b = a.length;
            let c = 0;
            for (let i = 0; i < b; i++) {
                c += Number(a[i]);
            }
            return c / b;
        }
        timeToSeconds(time) {
            // Convert a time in HH:MM:SS format to seconds
            const array = time.split(":");
            const length = array.length;
            let seconds = Number(array[length - 1]);
            if (length > 1) {
                seconds += Number(array[length - 2]) * 60;
            }
            if (length > 2) {
                seconds += Number(array[length - 3]) * 3600;
            }
            return seconds;
        }
    }

    const detectRunnersByName = (runners, routes) => {
        const modifiedRoutes = routes.map((route) => {
            const [firstName, lastName] = route.runnername.split(" ");
            return { firstName, lastName };
        });
        console.log(modifiedRoutes);
        runners.forEach((runner) => {
            runner.rerun2dRouteIndex = null;
            modifiedRoutes.forEach((route, index) => {
                if (runner.firstName.toLowerCase() === route.firstName.toLowerCase() &&
                    runner.lastName.toLowerCase() === route.lastName.toLowerCase()) {
                    runner.rerun2dRouteIndex = index;
                }
                else if (runner.firstName.toLowerCase() === route.lastName.toLowerCase() &&
                    runner.lastName.toLowerCase() === route.firstName.toLowerCase()) {
                    runner.rerun2dRouteIndex = index;
                }
                else if (runner.firstName.charAt(0).toLowerCase() ===
                    route.firstName.charAt(0).toLowerCase() &&
                    runner.lastName.toLowerCase() === route.lastName.toLowerCase()) {
                    runner.rerun2dRouteIndex = index;
                }
                else if (runner.firstName.charAt(0).toLowerCase() ===
                    route.lastName.charAt(0).toLowerCase() &&
                    runner.lastName.toLowerCase() === route.firstName.toLowerCase()) {
                    runner.rerun2dRouteIndex = index;
                }
                else if (runner.lastName.charAt(0).toLowerCase() ===
                    route.firstName.charAt(0).toLowerCase() &&
                    runner.firstName.toLowerCase() === route.lastName.toLowerCase()) {
                    runner.rerun2dRouteIndex = index;
                }
                else if (runner.lastName.charAt(0).toLowerCase() ===
                    route.lastName.charAt(0).toLowerCase() &&
                    runner.firstName.toLowerCase() === route.firstName.toLowerCase()) {
                    runner.rerun2dRouteIndex = index;
                }
            });
        });
        return runners;
    };

    const timeZones = [
      "+00:00",
      "+01:00",
      "+02:00",
      "+03:00",
      "+04:00",
      "+05:00",
      "+06:00",
      "+07:00",
      "+08:00",
      "+09:00",
      "+10:00",
      "+12:00",
      "+13:00",
      "+14:00",
      "+15:00",
      "+16:00",
      "+17:00",
      "+18:00",
      "+19:00",
      "+20:00",
      "+21:00",
      "+22:00",
      "+23:00",
    ];

    /* src\components\LoadSplitTimes.svelte generated by Svelte v3.46.4 */

    const { console: console_1$1 } = globals;
    const file$7 = "src\\components\\LoadSplitTimes.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	child_ctx[22] = list;
    	child_ctx[23] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	child_ctx[26] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (54:4) {#each classNames as className}
    function create_each_block_3(ctx) {
    	let option;
    	let t_value = /*className*/ ctx[5] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*className*/ ctx[5];
    			option.value = option.__value;
    			add_location(option, file$7, 54, 6, 1874);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*classNames*/ 2 && t_value !== (t_value = /*className*/ ctx[5] + "")) set_data_dev(t, t_value);

    			if (dirty & /*classNames*/ 2 && option_value_value !== (option_value_value = /*className*/ ctx[5])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(54:4) {#each classNames as className}",
    		ctx
    	});

    	return block;
    }

    // (62:4) {#each timeZones as timeZone}
    function create_each_block_2$1(ctx) {
    	let option;
    	let t_value = /*timeZone*/ ctx[6] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*timeZone*/ ctx[6];
    			option.value = option.__value;
    			add_location(option, file$7, 62, 6, 2115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(62:4) {#each timeZones as timeZone}",
    		ctx
    	});

    	return block;
    }

    // (100:14) {#each mapviewer.routes as route, index}
    function create_each_block_1$1(ctx) {
    	let option;
    	let t_value = /*route*/ ctx[24].runnername + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*index*/ ctx[26];
    			option.value = option.__value;
    			add_location(option, file$7, 100, 16, 3087);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*mapviewer*/ 1 && t_value !== (t_value = /*route*/ ctx[24].runnername + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(100:14) {#each mapviewer.routes as route, index}",
    		ctx
    	});

    	return block;
    }

    // (94:6) {#each runners as runner}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = `${/*runner*/ ctx[21].firstName} ${/*runner*/ ctx[21].lastName}` + "";
    	let t0;
    	let t1;
    	let td1;
    	let select;
    	let t2;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*mapviewer*/ ctx[0].routes;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[17].call(select, /*each_value*/ ctx[22], /*runner_index*/ ctx[23]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			add_location(td0, file$7, 95, 10, 2884);
    			if (/*runner*/ ctx[21].rerun2dRouteIndex === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$7, 98, 12, 2967);
    			add_location(td1, file$7, 97, 10, 2949);
    			add_location(tr, file$7, 94, 8, 2868);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*runner*/ ctx[21].rerun2dRouteIndex);
    			append_dev(tr, t2);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", select_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*runners*/ 8 && t0_value !== (t0_value = `${/*runner*/ ctx[21].firstName} ${/*runner*/ ctx[21].lastName}` + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*mapviewer*/ 1) {
    				each_value_1 = /*mapviewer*/ ctx[0].routes;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*runners*/ 8) {
    				select_option(select, /*runner*/ ctx[21].rerun2dRouteIndex);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(94:6) {#each runners as runner}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let form0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let label1;
    	let t4;
    	let select0;
    	let t5;
    	let label2;
    	let t7;
    	let select1;
    	let t8;
    	let t9;
    	let label3;
    	let t11;
    	let input1;
    	let t12;
    	let footer0;
    	let button0;
    	let t14;
    	let button1;
    	let t16;
    	let form1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t18;
    	let th1;
    	let t20;
    	let tbody;
    	let t21;
    	let footer1;
    	let button2;
    	let t23;
    	let button3;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*classNames*/ ctx[1];
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = timeZones;
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value = /*runners*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			form0 = element("form");
    			label0 = element("label");
    			label0.textContent = "Load IOF XML File";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			label1 = element("label");
    			label1.textContent = "Class";
    			t4 = space();
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t5 = space();
    			label2 = element("label");
    			label2.textContent = "Time zone";
    			t7 = space();
    			select1 = element("select");
    			t8 = text("timeZone\r\n    ");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t9 = space();
    			label3 = element("label");
    			label3.textContent = "Time offset (seconds)";
    			t11 = space();
    			input1 = element("input");
    			t12 = space();
    			footer0 = element("footer");
    			button0 = element("button");
    			button0.textContent = "Cancel";
    			t14 = space();
    			button1 = element("button");
    			button1.textContent = "Load splits";
    			t16 = space();
    			form1 = element("form");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Split times";
    			t18 = space();
    			th1 = element("th");
    			th1.textContent = "GPS track";
    			t20 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t21 = space();
    			footer1 = element("footer");
    			button2 = element("button");
    			button2.textContent = "Cancel";
    			t23 = space();
    			button3 = element("button");
    			button3.textContent = "Save split times";
    			attr_dev(label0, "for", "iof-xml-file");
    			add_location(label0, file$7, 43, 2, 1558);
    			attr_dev(input0, "name", "iof-xml-file");
    			attr_dev(input0, "id", "iof-xml-file");
    			attr_dev(input0, "type", "file");
    			add_location(input0, file$7, 44, 2, 1613);
    			attr_dev(label1, "for", "class");
    			add_location(label1, file$7, 51, 2, 1738);
    			attr_dev(select0, "name", "class");
    			attr_dev(select0, "id", "class");
    			if (/*className*/ ctx[5] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[13].call(select0));
    			add_location(select0, file$7, 52, 2, 1774);
    			attr_dev(label2, "for", "time-zone");
    			add_location(label2, file$7, 58, 2, 1952);
    			attr_dev(select1, "name", "time-zone");
    			attr_dev(select1, "id", "time-zone");
    			if (/*timeZone*/ ctx[6] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[14].call(select1));
    			add_location(select1, file$7, 59, 2, 1996);
    			attr_dev(label3, "for", "time-offset");
    			add_location(label3, file$7, 66, 2, 2191);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "name", "time-offset");
    			attr_dev(input1, "id", "time-offset");
    			add_location(input1, file$7, 67, 2, 2249);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "outline svelte-4g5xig");
    			add_location(button0, file$7, 75, 4, 2390);
    			attr_dev(button1, "type", "submit");
    			attr_dev(button1, "class", "svelte-4g5xig");
    			add_location(button1, file$7, 78, 4, 2498);
    			attr_dev(footer0, "class", "footer svelte-4g5xig");
    			add_location(footer0, file$7, 74, 2, 2361);
    			attr_dev(form0, "class", "step svelte-4g5xig");
    			toggle_class(form0, "slide-right", /*step*/ ctx[4] === 2);
    			add_location(form0, file$7, 42, 0, 1480);
    			add_location(th0, file$7, 86, 8, 2688);
    			add_location(th1, file$7, 87, 8, 2718);
    			add_location(tr, file$7, 85, 6, 2674);
    			add_location(thead, file$7, 84, 4, 2659);
    			add_location(tbody, file$7, 92, 4, 2818);
    			add_location(table, file$7, 83, 2, 2646);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "outline svelte-4g5xig");
    			add_location(button2, file$7, 112, 4, 3326);
    			attr_dev(button3, "type", "submit");
    			attr_dev(button3, "class", "svelte-4g5xig");
    			add_location(button3, file$7, 115, 4, 3427);
    			attr_dev(footer1, "class", "footer svelte-4g5xig");
    			add_location(footer1, file$7, 111, 2, 3297);
    			attr_dev(form1, "class", "step svelte-4g5xig");
    			toggle_class(form1, "slide-left", /*step*/ ctx[4] === 1);
    			add_location(form1, file$7, 82, 0, 2566);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form0, anchor);
    			append_dev(form0, label0);
    			append_dev(form0, t1);
    			append_dev(form0, input0);
    			append_dev(form0, t2);
    			append_dev(form0, label1);
    			append_dev(form0, t4);
    			append_dev(form0, select0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(select0, null);
    			}

    			select_option(select0, /*className*/ ctx[5]);
    			append_dev(form0, t5);
    			append_dev(form0, label2);
    			append_dev(form0, t7);
    			append_dev(form0, select1);
    			append_dev(select1, t8);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select1, null);
    			}

    			select_option(select1, /*timeZone*/ ctx[6]);
    			append_dev(form0, t9);
    			append_dev(form0, label3);
    			append_dev(form0, t11);
    			append_dev(form0, input1);
    			set_input_value(input1, /*timeOffset*/ ctx[2]);
    			append_dev(form0, t12);
    			append_dev(form0, footer0);
    			append_dev(footer0, button0);
    			append_dev(footer0, t14);
    			append_dev(footer0, button1);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, form1, anchor);
    			append_dev(form1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t18);
    			append_dev(tr, th1);
    			append_dev(table, t20);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(form1, t21);
    			append_dev(form1, footer1);
    			append_dev(footer1, button2);
    			append_dev(footer1, t23);
    			append_dev(footer1, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*change_handler*/ ctx[12], false, false, false),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[13]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[15]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[16], false, false, false),
    					listen_dev(form0, "submit", /*parseIOFXML*/ ctx[9], false, false, false),
    					listen_dev(button2, "click", /*click_handler_1*/ ctx[18], false, false, false),
    					listen_dev(form1, "submit", /*saveSplitTimes*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*classNames*/ 2) {
    				each_value_3 = /*classNames*/ ctx[1];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty & /*className, classNames*/ 34) {
    				select_option(select0, /*className*/ ctx[5]);
    			}

    			if (dirty & /*timeZones*/ 0) {
    				each_value_2 = timeZones;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*timeZone, timeZones*/ 64) {
    				select_option(select1, /*timeZone*/ ctx[6]);
    			}

    			if (dirty & /*timeOffset*/ 4 && to_number(input1.value) !== /*timeOffset*/ ctx[2]) {
    				set_input_value(input1, /*timeOffset*/ ctx[2]);
    			}

    			if (dirty & /*step*/ 16) {
    				toggle_class(form0, "slide-right", /*step*/ ctx[4] === 2);
    			}

    			if (dirty & /*runners, mapviewer*/ 9) {
    				each_value = /*runners*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*step*/ 16) {
    				toggle_class(form1, "slide-left", /*step*/ ctx[4] === 1);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form0);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(form1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadSplitTimes', slots, []);
    	let { savedSplitTimes } = $$props;
    	let { mapviewer } = $$props;
    	let xmlDoc;
    	let classNames = [];
    	let className;
    	let timeZone = timeZones[1];
    	let timeOffset = 0;
    	let splitTimes;
    	let runners = [];
    	let step = 1;
    	const dispatch = createEventDispatcher();

    	const onFileSelected = event => {
    		let xmlFile = event.target.files[0];
    		let reader = new FileReader();

    		reader.onload = function (e) {
    			let readXml = e.target.result;
    			let parser = new DOMParser();
    			xmlDoc = parser.parseFromString(readXml.toString(), "application/xml");
    			$$invalidate(1, classNames = Array.from(xmlDoc.querySelectorAll("ClassResult Class Name")).map(cl => cl.innerHTML));
    		};

    		reader.readAsText(xmlFile);
    	};

    	const parseIOFXML = event => {
    		event.preventDefault();
    		splitTimes = new IOFXMLParser(xmlDoc, className, 1.2, timeZone, timeOffset);
    		$$invalidate(3, runners = detectRunnersByName([...splitTimes.runners], [...mapviewer.routes]));
    		$$invalidate(4, step += 1);
    		console.log(splitTimes, runners);
    	};

    	const saveSplitTimes = () => {
    		$$invalidate(11, savedSplitTimes = splitTimes);
    		$$invalidate(11, savedSplitTimes.runners = runners, savedSplitTimes);
    		dispatch("close");
    	};

    	const writable_props = ['savedSplitTimes', 'mapviewer'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<LoadSplitTimes> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => onFileSelected(e);

    	function select0_change_handler() {
    		className = select_value(this);
    		$$invalidate(5, className);
    		$$invalidate(1, classNames);
    	}

    	function select1_change_handler() {
    		timeZone = select_value(this);
    		$$invalidate(6, timeZone);
    	}

    	function input1_input_handler() {
    		timeOffset = to_number(this.value);
    		$$invalidate(2, timeOffset);
    	}

    	const click_handler = () => dispatch("close");

    	function select_change_handler(each_value, runner_index) {
    		each_value[runner_index].rerun2dRouteIndex = select_value(this);
    		$$invalidate(3, runners);
    	}

    	const click_handler_1 = () => $$invalidate(4, step = 1);

    	$$self.$$set = $$props => {
    		if ('savedSplitTimes' in $$props) $$invalidate(11, savedSplitTimes = $$props.savedSplitTimes);
    		if ('mapviewer' in $$props) $$invalidate(0, mapviewer = $$props.mapviewer);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		IOFXMLParser,
    		detectRunnersByName,
    		timeZones,
    		savedSplitTimes,
    		mapviewer,
    		xmlDoc,
    		classNames,
    		className,
    		timeZone,
    		timeOffset,
    		splitTimes,
    		runners,
    		step,
    		dispatch,
    		onFileSelected,
    		parseIOFXML,
    		saveSplitTimes
    	});

    	$$self.$inject_state = $$props => {
    		if ('savedSplitTimes' in $$props) $$invalidate(11, savedSplitTimes = $$props.savedSplitTimes);
    		if ('mapviewer' in $$props) $$invalidate(0, mapviewer = $$props.mapviewer);
    		if ('xmlDoc' in $$props) xmlDoc = $$props.xmlDoc;
    		if ('classNames' in $$props) $$invalidate(1, classNames = $$props.classNames);
    		if ('className' in $$props) $$invalidate(5, className = $$props.className);
    		if ('timeZone' in $$props) $$invalidate(6, timeZone = $$props.timeZone);
    		if ('timeOffset' in $$props) $$invalidate(2, timeOffset = $$props.timeOffset);
    		if ('splitTimes' in $$props) splitTimes = $$props.splitTimes;
    		if ('runners' in $$props) $$invalidate(3, runners = $$props.runners);
    		if ('step' in $$props) $$invalidate(4, step = $$props.step);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		mapviewer,
    		classNames,
    		timeOffset,
    		runners,
    		step,
    		className,
    		timeZone,
    		dispatch,
    		onFileSelected,
    		parseIOFXML,
    		saveSplitTimes,
    		savedSplitTimes,
    		change_handler,
    		select0_change_handler,
    		select1_change_handler,
    		input1_input_handler,
    		click_handler,
    		select_change_handler,
    		click_handler_1
    	];
    }

    class LoadSplitTimes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { savedSplitTimes: 11, mapviewer: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadSplitTimes",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*savedSplitTimes*/ ctx[11] === undefined && !('savedSplitTimes' in props)) {
    			console_1$1.warn("<LoadSplitTimes> was created without expected prop 'savedSplitTimes'");
    		}

    		if (/*mapviewer*/ ctx[0] === undefined && !('mapviewer' in props)) {
    			console_1$1.warn("<LoadSplitTimes> was created without expected prop 'mapviewer'");
    		}
    	}

    	get savedSplitTimes() {
    		throw new Error("<LoadSplitTimes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set savedSplitTimes(value) {
    		throw new Error("<LoadSplitTimes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mapviewer() {
    		throw new Error("<LoadSplitTimes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mapviewer(value) {
    		throw new Error("<LoadSplitTimes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const secondsToPrettyTime = (seconds) => {
      // Convert seconds in number format to string in HH:MM:SS string format
      let hours = Math.trunc(seconds / 3600);
      let remainingSeconds = seconds % 3600;
      let minutes = Math.trunc(remainingSeconds / 60);
      remainingSeconds = remainingSeconds % 60;
      if (hours === 0 && minutes === 0) {
        return String(remainingSeconds);
      } else if (hours === 0) {
        if (remainingSeconds < 10) {
          return String(minutes) + ":0" + String(remainingSeconds);
        } else {
          return String(minutes) + ":" + String(remainingSeconds);
        }
      } else if (minutes < 10) {
        return (
          String(hours) + ":0" + String(minutes) + ":" + String(remainingSeconds)
        );
      }
      return String(hours) + ":" + String(minutes) + ":" + String(remainingSeconds);
    };

    const fullNameToShortName = (firstName, lastName) => {
      if (firstName.length === 1 || lastName.length === 1) {
        return `${firstName} ${lastName}`;
      }

      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    const rankToCSSClass = (rank) => {
      if (rank === 1) {
        return "first";
      } else if (rank === 2) {
        return "second";
      } else if (rank === 3) {
        return "third";
      }

      return "";
    };

    /* src\components\SplitTimesTable\LegSplitTimesTable.svelte generated by Svelte v3.46.4 */
    const file$6 = "src\\components\\SplitTimesTable\\LegSplitTimesTable.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (57:12) {#if runner.leg.isMistake === true}
    function create_if_block_2$2(ctx) {
    	let div;
    	let t_value = `Time loss: ${secondsToPrettyTime(/*runner*/ ctx[3].leg.timeLost)}` + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$6, 57, 14, 1527);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*legSplitTimes*/ 1 && t_value !== (t_value = `Time loss: ${secondsToPrettyTime(/*runner*/ ctx[3].leg.timeLost)}` + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(57:12) {#if runner.leg.isMistake === true}",
    		ctx
    	});

    	return block;
    }

    // (65:8) {#if runner.leg.timeOverall !== null}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t0_value = `${secondsToPrettyTime(/*runner*/ ctx[3].leg.timeOverall)} (${/*runner*/ ctx[3].leg.rankOverall})` + "";
    	let t0;
    	let t1;
    	let span;
    	let t2_value = `+ ${secondsToPrettyTime(/*runner*/ ctx[3].leg.timeBehindOverall)}` + "";
    	let t2;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			attr_dev(span, "class", "tooltip svelte-hj9rsg");
    			add_location(span, file$6, 72, 12, 1980);
    			attr_dev(div, "class", div_class_value = "tooltip-container " + rankToCSSClass(/*runner*/ ctx[3].leg.rankOverall) + " svelte-hj9rsg");
    			add_location(div, file$6, 65, 10, 1745);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, span);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*legSplitTimes*/ 1 && t0_value !== (t0_value = `${secondsToPrettyTime(/*runner*/ ctx[3].leg.timeOverall)} (${/*runner*/ ctx[3].leg.rankOverall})` + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*legSplitTimes*/ 1 && t2_value !== (t2_value = `+ ${secondsToPrettyTime(/*runner*/ ctx[3].leg.timeBehindOverall)}` + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*legSplitTimes*/ 1 && div_class_value !== (div_class_value = "tooltip-container " + rankToCSSClass(/*runner*/ ctx[3].leg.rankOverall) + " svelte-hj9rsg")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(65:8) {#if runner.leg.timeOverall !== null}",
    		ctx
    	});

    	return block;
    }

    // (81:8) {#if runner.leg.routeChoice}
    function create_if_block$2(ctx) {
    	let strong;
    	let t_value = /*runner*/ ctx[3].leg.routeChoice.name + "";
    	let t;

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			t = text(t_value);
    			set_style(strong, "color", `#${/*runner*/ ctx[3].leg.routeChoice.color}`, false);
    			add_location(strong, file$6, 81, 10, 2221);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);
    			append_dev(strong, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*legSplitTimes*/ 1 && t_value !== (t_value = /*runner*/ ctx[3].leg.routeChoice.name + "")) set_data_dev(t, t_value);

    			if (dirty & /*legSplitTimes*/ 1) {
    				set_style(strong, "color", `#${/*runner*/ ctx[3].leg.routeChoice.color}`, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(81:8) {#if runner.leg.routeChoice}",
    		ctx
    	});

    	return block;
    }

    // (38:2) {#each legSplitTimes as runner}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let div0;
    	let t0_value = fullNameToShortName(/*runner*/ ctx[3].firstName, /*runner*/ ctx[3].lastName) + "";
    	let t0;
    	let t1;
    	let span0;
    	let t2_value = `${/*runner*/ ctx[3].firstName} ${/*runner*/ ctx[3].lastName}` + "";
    	let t2;
    	let t3;
    	let td1;
    	let div2;
    	let t4_value = `${secondsToPrettyTime(/*runner*/ ctx[3].leg.time)} (${/*runner*/ ctx[3].leg.rankSplit})` + "";
    	let t4;
    	let t5;
    	let span1;
    	let div1;
    	let t6_value = `+ ${secondsToPrettyTime(/*runner*/ ctx[3].leg.timeBehindSplit)}` + "";
    	let t6;
    	let t7;
    	let div2_class_value;
    	let t8;
    	let td1_class_value;
    	let t9;
    	let td2;
    	let if_block0 = /*runner*/ ctx[3].leg.isMistake === true && create_if_block_2$2(ctx);
    	let if_block1 = /*runner*/ ctx[3].leg.timeOverall !== null && create_if_block_1$2(ctx);
    	let if_block2 = /*runner*/ ctx[3].leg.routeChoice && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			span0 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			td1 = element("td");
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			span1 = element("span");
    			div1 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			if (if_block0) if_block0.c();
    			t8 = space();
    			if (if_block1) if_block1.c();
    			t9 = space();
    			td2 = element("td");
    			if (if_block2) if_block2.c();
    			attr_dev(span0, "class", "tooltip svelte-hj9rsg");
    			add_location(span0, file$6, 42, 10, 968);
    			attr_dev(div0, "class", "tooltip-container svelte-hj9rsg");
    			add_location(div0, file$6, 40, 8, 857);
    			add_location(td0, file$6, 39, 6, 843);
    			add_location(div1, file$6, 52, 12, 1363);
    			attr_dev(span1, "class", "tooltip svelte-hj9rsg");
    			add_location(span1, file$6, 51, 10, 1327);
    			attr_dev(div2, "class", div2_class_value = "tooltip-container " + rankToCSSClass(/*runner*/ ctx[3].leg.rankSplit) + " svelte-hj9rsg");
    			add_location(div2, file$6, 49, 8, 1164);
    			attr_dev(td1, "class", td1_class_value = "" + (null_to_empty(/*runner*/ ctx[3].leg.isMistake ? "mistake" : "") + " svelte-hj9rsg"));
    			add_location(td1, file$6, 48, 6, 1104);
    			attr_dev(td2, "class", "right svelte-hj9rsg");
    			add_location(td2, file$6, 79, 6, 2153);
    			add_location(tr, file$6, 38, 4, 831);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span0);
    			append_dev(span0, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td1);
    			append_dev(td1, div2);
    			append_dev(div2, t4);
    			append_dev(div2, t5);
    			append_dev(div2, span1);
    			append_dev(span1, div1);
    			append_dev(div1, t6);
    			append_dev(span1, t7);
    			if (if_block0) if_block0.m(span1, null);
    			append_dev(td1, t8);
    			if (if_block1) if_block1.m(td1, null);
    			append_dev(tr, t9);
    			append_dev(tr, td2);
    			if (if_block2) if_block2.m(td2, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*legSplitTimes*/ 1 && t0_value !== (t0_value = fullNameToShortName(/*runner*/ ctx[3].firstName, /*runner*/ ctx[3].lastName) + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*legSplitTimes*/ 1 && t2_value !== (t2_value = `${/*runner*/ ctx[3].firstName} ${/*runner*/ ctx[3].lastName}` + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*legSplitTimes*/ 1 && t4_value !== (t4_value = `${secondsToPrettyTime(/*runner*/ ctx[3].leg.time)} (${/*runner*/ ctx[3].leg.rankSplit})` + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*legSplitTimes*/ 1 && t6_value !== (t6_value = `+ ${secondsToPrettyTime(/*runner*/ ctx[3].leg.timeBehindSplit)}` + "")) set_data_dev(t6, t6_value);

    			if (/*runner*/ ctx[3].leg.isMistake === true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					if_block0.m(span1, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*legSplitTimes*/ 1 && div2_class_value !== (div2_class_value = "tooltip-container " + rankToCSSClass(/*runner*/ ctx[3].leg.rankSplit) + " svelte-hj9rsg")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (/*runner*/ ctx[3].leg.timeOverall !== null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(td1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*legSplitTimes*/ 1 && td1_class_value !== (td1_class_value = "" + (null_to_empty(/*runner*/ ctx[3].leg.isMistake ? "mistake" : "") + " svelte-hj9rsg"))) {
    				attr_dev(td1, "class", td1_class_value);
    			}

    			if (/*runner*/ ctx[3].leg.routeChoice) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					if_block2.m(td2, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(38:2) {#each legSplitTimes as runner}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let t6;
    	let tbody;
    	let each_value = /*legSplitTimes*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Runners";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Time";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Routechoice";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			tbody = element("tbody");
    			attr_dev(th0, "class", "sticky-header svelte-hj9rsg");
    			add_location(th0, file$6, 30, 6, 626);
    			attr_dev(th1, "class", "sticky-header svelte-hj9rsg");
    			add_location(th1, file$6, 32, 6, 674);
    			attr_dev(th2, "class", "sticky-header right svelte-hj9rsg");
    			add_location(th2, file$6, 34, 6, 719);
    			add_location(tr, file$6, 29, 4, 614);
    			add_location(thead, file$6, 28, 2, 601);
    			add_location(tbody, file$6, 88, 2, 2396);
    			attr_dev(table, "class", "svelte-hj9rsg");
    			add_location(table, file$6, 27, 0, 590);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(table, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(table, t6);
    			append_dev(table, tbody);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*legSplitTimes, rankToCSSClass, secondsToPrettyTime, fullNameToShortName*/ 1) {
    				each_value = /*legSplitTimes*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, t6);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LegSplitTimesTable', slots, []);
    	let { splitTimes } = $$props;
    	let { legNumber } = $$props;
    	let legSplitTimes;
    	const writable_props = ['splitTimes', 'legNumber'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LegSplitTimesTable> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('splitTimes' in $$props) $$invalidate(1, splitTimes = $$props.splitTimes);
    		if ('legNumber' in $$props) $$invalidate(2, legNumber = $$props.legNumber);
    	};

    	$$self.$capture_state = () => ({
    		rankToCSSClass,
    		secondsToPrettyTime,
    		fullNameToShortName,
    		splitTimes,
    		legNumber,
    		legSplitTimes
    	});

    	$$self.$inject_state = $$props => {
    		if ('splitTimes' in $$props) $$invalidate(1, splitTimes = $$props.splitTimes);
    		if ('legNumber' in $$props) $$invalidate(2, legNumber = $$props.legNumber);
    		if ('legSplitTimes' in $$props) $$invalidate(0, legSplitTimes = $$props.legSplitTimes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*splitTimes, legNumber, legSplitTimes*/ 7) {
    			{
    				$$invalidate(0, legSplitTimes = splitTimes.runners.map(runner => {
    					let returnedRunner = { ...runner };
    					let leg = runner.legs[legNumber - 1];
    					delete returnedRunner.legs;
    					returnedRunner.leg = leg;
    					return returnedRunner;
    				}));

    				$$invalidate(0, legSplitTimes = legSplitTimes.sort((runner1, runner2) => runner1.leg.time - runner2.leg.time));
    			}
    		}
    	};

    	return [legSplitTimes, splitTimes, legNumber];
    }

    class LegSplitTimesTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { splitTimes: 1, legNumber: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LegSplitTimesTable",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*splitTimes*/ ctx[1] === undefined && !('splitTimes' in props)) {
    			console.warn("<LegSplitTimesTable> was created without expected prop 'splitTimes'");
    		}

    		if (/*legNumber*/ ctx[2] === undefined && !('legNumber' in props)) {
    			console.warn("<LegSplitTimesTable> was created without expected prop 'legNumber'");
    		}
    	}

    	get splitTimes() {
    		throw new Error("<LegSplitTimesTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set splitTimes(value) {
    		throw new Error("<LegSplitTimesTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legNumber() {
    		throw new Error("<LegSplitTimesTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legNumber(value) {
    		throw new Error("<LegSplitTimesTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SplitTimesTable\SplitTimesTable.svelte generated by Svelte v3.46.4 */
    const file$5 = "src\\components\\SplitTimesTable\\SplitTimesTable.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (21:12) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Finish");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(21:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:12) {#if index !== splitTimes.course.length - 1}
    function create_if_block_4$1(ctx) {
    	let t_value = `${/*index*/ ctx[9] + 1} (${/*control*/ ctx[7]})` + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*splitTimes*/ 1 && t_value !== (t_value = `${/*index*/ ctx[9] + 1} (${/*control*/ ctx[7]})` + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(19:12) {#if index !== splitTimes.course.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (17:8) {#each splitTimes.course as control, index}
    function create_each_block_2(ctx) {
    	let th;
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (/*index*/ ctx[9] !== /*splitTimes*/ ctx[0].course.length - 1) return create_if_block_4$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if_block.c();
    			t = space();
    			attr_dev(th, "class", "sticky-header svelte-brp1al");
    			add_location(th, file$5, 17, 10, 358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			if_block.m(th, null);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(th, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(17:8) {#each splitTimes.course as control, index}",
    		ctx
    	});

    	return block;
    }

    // (37:12) {#if runner.status === "OK"}
    function create_if_block_2$1(ctx) {
    	let div1;
    	let t0_value = `${secondsToPrettyTime(/*runner*/ ctx[1].time)} (${/*runner*/ ctx[1].rank})` + "";
    	let t0;
    	let t1;
    	let span;
    	let div0;
    	let t2_value = `+ ${secondsToPrettyTime(/*runner*/ ctx[1].timeBehind)}` + "";
    	let t2;
    	let t3;
    	let if_block = /*runner*/ ctx[1].totalTimeLost !== 0 && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			div0 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			add_location(div0, file$5, 41, 18, 1078);
    			attr_dev(span, "class", "tooltip tooltip-top svelte-brp1al");
    			add_location(span, file$5, 40, 16, 1024);
    			attr_dev(div1, "class", "tooltip-container svelte-brp1al");
    			add_location(div1, file$5, 37, 14, 899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, span);
    			append_dev(span, div0);
    			append_dev(div0, t2);
    			append_dev(span, t3);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*splitTimes*/ 1 && t0_value !== (t0_value = `${secondsToPrettyTime(/*runner*/ ctx[1].time)} (${/*runner*/ ctx[1].rank})` + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*splitTimes*/ 1 && t2_value !== (t2_value = `+ ${secondsToPrettyTime(/*runner*/ ctx[1].timeBehind)}` + "")) set_data_dev(t2, t2_value);

    			if (/*runner*/ ctx[1].totalTimeLost !== 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$1(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(37:12) {#if runner.status === \\\"OK\\\"}",
    		ctx
    	});

    	return block;
    }

    // (44:18) {#if runner.totalTimeLost !== 0}
    function create_if_block_3$1(ctx) {
    	let div;
    	let t_value = `Time loss: ${secondsToPrettyTime(/*runner*/ ctx[1].totalTimeLost)}` + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$5, 44, 20, 1212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*splitTimes*/ 1 && t_value !== (t_value = `Time loss: ${secondsToPrettyTime(/*runner*/ ctx[1].totalTimeLost)}` + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(44:18) {#if runner.totalTimeLost !== 0}",
    		ctx
    	});

    	return block;
    }

    // (63:18) {#if leg.isMistake === true}
    function create_if_block_1$1(ctx) {
    	let div;
    	let t_value = `Time loss: ${secondsToPrettyTime(/*leg*/ ctx[4].timeLost)}` + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$5, 63, 20, 1927);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*splitTimes*/ 1 && t_value !== (t_value = `Time loss: ${secondsToPrettyTime(/*leg*/ ctx[4].timeLost)}` + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(63:18) {#if leg.isMistake === true}",
    		ctx
    	});

    	return block;
    }

    // (71:14) {#if leg.timeOverall !== null}
    function create_if_block$1(ctx) {
    	let div;
    	let t0_value = `${secondsToPrettyTime(/*leg*/ ctx[4].timeOverall)} (${/*leg*/ ctx[4].rankOverall})` + "";
    	let t0;
    	let t1;
    	let span;
    	let t2_value = `+ ${secondsToPrettyTime(/*leg*/ ctx[4].timeBehindOverall)}` + "";
    	let t2;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			attr_dev(span, "class", "tooltip svelte-brp1al");
    			add_location(span, file$5, 78, 18, 2423);
    			attr_dev(div, "class", div_class_value = "tooltip-container " + rankToCSSClass(/*leg*/ ctx[4].rankOverall) + " svelte-brp1al");
    			add_location(div, file$5, 71, 16, 2173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, span);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*splitTimes*/ 1 && t0_value !== (t0_value = `${secondsToPrettyTime(/*leg*/ ctx[4].timeOverall)} (${/*leg*/ ctx[4].rankOverall})` + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*splitTimes*/ 1 && t2_value !== (t2_value = `+ ${secondsToPrettyTime(/*leg*/ ctx[4].timeBehindOverall)}` + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*splitTimes*/ 1 && div_class_value !== (div_class_value = "tooltip-container " + rankToCSSClass(/*leg*/ ctx[4].rankOverall) + " svelte-brp1al")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(71:14) {#if leg.timeOverall !== null}",
    		ctx
    	});

    	return block;
    }

    // (56:10) {#each runner.legs as leg}
    function create_each_block_1(ctx) {
    	let td;
    	let div1;
    	let t0_value = `${secondsToPrettyTime(/*leg*/ ctx[4].time)} (${/*leg*/ ctx[4].rankSplit})` + "";
    	let t0;
    	let t1;
    	let span;
    	let div0;
    	let t2_value = `+ ${secondsToPrettyTime(/*leg*/ ctx[4].timeBehindSplit)}` + "";
    	let t2;
    	let t3;
    	let div1_class_value;
    	let t4;
    	let td_class_value;
    	let if_block0 = /*leg*/ ctx[4].isMistake === true && create_if_block_1$1(ctx);
    	let if_block1 = /*leg*/ ctx[4].timeOverall !== null && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			div1 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			div0 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			add_location(div0, file$5, 60, 18, 1795);
    			attr_dev(span, "class", "tooltip svelte-brp1al");
    			add_location(span, file$5, 59, 16, 1753);
    			attr_dev(div1, "class", div1_class_value = "tooltip-container " + rankToCSSClass(/*leg*/ ctx[4].rankSplit) + " svelte-brp1al");
    			add_location(div1, file$5, 57, 14, 1599);
    			attr_dev(td, "class", td_class_value = "" + (null_to_empty(/*leg*/ ctx[4].isMistake ? "mistake" : "") + " svelte-brp1al"));
    			add_location(td, file$5, 56, 12, 1540);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, div1);
    			append_dev(div1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, span);
    			append_dev(span, div0);
    			append_dev(div0, t2);
    			append_dev(span, t3);
    			if (if_block0) if_block0.m(span, null);
    			append_dev(td, t4);
    			if (if_block1) if_block1.m(td, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*splitTimes*/ 1 && t0_value !== (t0_value = `${secondsToPrettyTime(/*leg*/ ctx[4].time)} (${/*leg*/ ctx[4].rankSplit})` + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*splitTimes*/ 1 && t2_value !== (t2_value = `+ ${secondsToPrettyTime(/*leg*/ ctx[4].timeBehindSplit)}` + "")) set_data_dev(t2, t2_value);

    			if (/*leg*/ ctx[4].isMistake === true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(span, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*splitTimes*/ 1 && div1_class_value !== (div1_class_value = "tooltip-container " + rankToCSSClass(/*leg*/ ctx[4].rankSplit) + " svelte-brp1al")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (/*leg*/ ctx[4].timeOverall !== null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(td, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*splitTimes*/ 1 && td_class_value !== (td_class_value = "" + (null_to_empty(/*leg*/ ctx[4].isMistake ? "mistake" : "") + " svelte-brp1al"))) {
    				attr_dev(td, "class", td_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(56:10) {#each runner.legs as leg}",
    		ctx
    	});

    	return block;
    }

    // (30:6) {#each splitTimes.runners as runner}
    function create_each_block$1(ctx) {
    	let tr;
    	let td;
    	let div;
    	let t0_value = fullNameToShortName(/*runner*/ ctx[1].firstName, /*runner*/ ctx[1].lastName) + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let if_block = /*runner*/ ctx[1].status === "OK" && create_if_block_2$1(ctx);
    	let each_value_1 = /*runner*/ ctx[1].legs;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			add_location(div, file$5, 32, 12, 742);
    			attr_dev(td, "class", "sticky-column-header svelte-brp1al");
    			add_location(td, file$5, 31, 10, 695);
    			add_location(tr, file$5, 30, 8, 679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, div);
    			append_dev(div, t0);
    			append_dev(td, t1);
    			if (if_block) if_block.m(td, null);
    			append_dev(tr, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*splitTimes*/ 1 && t0_value !== (t0_value = fullNameToShortName(/*runner*/ ctx[1].firstName, /*runner*/ ctx[1].lastName) + "")) set_data_dev(t0, t0_value);

    			if (/*runner*/ ctx[1].status === "OK") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(td, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*splitTimes, rankToCSSClass, secondsToPrettyTime*/ 1) {
    				each_value_1 = /*runner*/ ctx[1].legs;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t3);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(30:6) {#each splitTimes.runners as runner}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr;
    	let th;
    	let t1;
    	let t2;
    	let tbody;
    	let each_value_2 = /*splitTimes*/ ctx[0].course;
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*splitTimes*/ ctx[0].runners;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th = element("th");
    			th.textContent = "Runners";
    			t1 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th, "class", "sticky-header sticky-column-header svelte-brp1al");
    			add_location(th, file$5, 14, 8, 232);
    			add_location(tr, file$5, 13, 6, 218);
    			add_location(thead, file$5, 12, 4, 203);
    			attr_dev(tbody, "class", "svelte-brp1al");
    			add_location(tbody, file$5, 28, 4, 618);
    			attr_dev(table, "class", "svelte-brp1al");
    			add_location(table, file$5, 11, 2, 190);
    			attr_dev(div, "class", "table-container svelte-brp1al");
    			add_location(div, file$5, 10, 0, 157);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th);
    			append_dev(tr, t1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t2);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*splitTimes*/ 1) {
    				each_value_2 = /*splitTimes*/ ctx[0].course;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*splitTimes, rankToCSSClass, secondsToPrettyTime, fullNameToShortName*/ 1) {
    				each_value = /*splitTimes*/ ctx[0].runners;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SplitTimesTable', slots, []);
    	let { splitTimes } = $$props;
    	const writable_props = ['splitTimes'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SplitTimesTable> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('splitTimes' in $$props) $$invalidate(0, splitTimes = $$props.splitTimes);
    	};

    	$$self.$capture_state = () => ({
    		rankToCSSClass,
    		secondsToPrettyTime,
    		fullNameToShortName,
    		splitTimes
    	});

    	$$self.$inject_state = $$props => {
    		if ('splitTimes' in $$props) $$invalidate(0, splitTimes = $$props.splitTimes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [splitTimes];
    }

    class SplitTimesTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { splitTimes: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SplitTimesTable",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*splitTimes*/ ctx[0] === undefined && !('splitTimes' in props)) {
    			console.warn("<SplitTimesTable> was created without expected prop 'splitTimes'");
    		}
    	}

    	get splitTimes() {
    		throw new Error("<SplitTimesTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set splitTimes(value) {
    		throw new Error("<SplitTimesTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Graph.svelte generated by Svelte v3.46.4 */

    const file$4 = "src\\components\\Graph.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (10:0) {#each data as item}
    function create_each_block(ctx) {
    	let p;
    	let t0_value = /*item*/ ctx[3].label + "";
    	let t0;
    	let span1;
    	let span0;
    	let span0_data_tooltip_value;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			span1 = element("span");
    			span0 = element("span");
    			t1 = space();
    			attr_dev(span0, "data-tooltip", span0_data_tooltip_value = `${/*item*/ ctx[3].value}${/*suffix*/ ctx[1]}`);
    			attr_dev(span0, "class", "bar svelte-1c9a8px");
    			set_style(span0, "background-color", `#${/*item*/ ctx[3].color}`, false);
    			set_style(span0, "width", `${/*item*/ ctx[3].value * 100 / /*max*/ ctx[2]}%`, false);
    			add_location(span0, file$4, 18, 6, 430);
    			attr_dev(span1, "class", "bar-group svelte-1c9a8px");
    			add_location(span1, file$4, 11, 16, 211);
    			attr_dev(p, "class", "graph-item svelte-1c9a8px");
    			add_location(p, file$4, 10, 2, 171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, span1);
    			append_dev(span1, span0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && t0_value !== (t0_value = /*item*/ ctx[3].label + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*data, suffix*/ 3 && span0_data_tooltip_value !== (span0_data_tooltip_value = `${/*item*/ ctx[3].value}${/*suffix*/ ctx[1]}`)) {
    				attr_dev(span0, "data-tooltip", span0_data_tooltip_value);
    			}

    			if (dirty & /*data*/ 1) {
    				set_style(span0, "background-color", `#${/*item*/ ctx[3].color}`, false);
    			}

    			if (dirty & /*data, max*/ 5) {
    				set_style(span0, "width", `${/*item*/ ctx[3].value * 100 / /*max*/ ctx[2]}%`, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(10:0) {#each data as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let each_1_anchor;
    	let each_value = /*data*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data, suffix, max*/ 7) {
    				each_value = /*data*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Graph', slots, []);
    	let { data } = $$props;
    	let { suffix = "" } = $$props;
    	let max = 0;
    	const writable_props = ['data', 'suffix'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Graph> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('suffix' in $$props) $$invalidate(1, suffix = $$props.suffix);
    	};

    	$$self.$capture_state = () => ({ data, suffix, max });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('suffix' in $$props) $$invalidate(1, suffix = $$props.suffix);
    		if ('max' in $$props) $$invalidate(2, max = $$props.max);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data*/ 1) {
    			$$invalidate(2, max = Math.max(...data.map(item => item.value)));
    		}
    	};

    	return [data, suffix, max];
    }

    class Graph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { data: 0, suffix: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Graph",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<Graph> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suffix() {
    		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suffix(value) {
    		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Statistics.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1 } = globals;
    const file$3 = "src\\components\\Statistics.svelte";

    function create_fragment$3(ctx) {
    	let h30;
    	let t1;
    	let graph0;
    	let t2;
    	let h31;
    	let t4;
    	let graph1;
    	let current;

    	graph0 = new Graph({
    			props: {
    				data: /*fasestTimeGraphData*/ ctx[0],
    				suffix: " s"
    			},
    			$$inline: true
    		});

    	graph1 = new Graph({
    			props: { data: /*runnerNumberGraphData*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h30 = element("h3");
    			h30.textContent = "Fastest Time";
    			t1 = space();
    			create_component(graph0.$$.fragment);
    			t2 = space();
    			h31 = element("h3");
    			h31.textContent = "Number of runners";
    			t4 = space();
    			create_component(graph1.$$.fragment);
    			add_location(h30, file$3, 30, 0, 1049);
    			add_location(h31, file$3, 34, 0, 1128);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h30, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(graph0, target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h31, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(graph1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const graph0_changes = {};
    			if (dirty & /*fasestTimeGraphData*/ 1) graph0_changes.data = /*fasestTimeGraphData*/ ctx[0];
    			graph0.$set(graph0_changes);
    			const graph1_changes = {};
    			if (dirty & /*runnerNumberGraphData*/ 2) graph1_changes.data = /*runnerNumberGraphData*/ ctx[1];
    			graph1.$set(graph1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(graph0.$$.fragment, local);
    			transition_in(graph1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(graph0.$$.fragment, local);
    			transition_out(graph1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h30);
    			if (detaching) detach_dev(t1);
    			destroy_component(graph0, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h31);
    			if (detaching) detach_dev(t4);
    			destroy_component(graph1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function sortString(a, b) {
    	return a.label.localeCompare(b.label);
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Statistics', slots, []);
    	let { splitTimes } = $$props;
    	let { legNumber } = $$props;
    	let fasestTimeGraphData = [];
    	let runnerNumberGraphData = [];
    	const writable_props = ['splitTimes', 'legNumber'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Statistics> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('splitTimes' in $$props) $$invalidate(2, splitTimes = $$props.splitTimes);
    		if ('legNumber' in $$props) $$invalidate(3, legNumber = $$props.legNumber);
    	};

    	$$self.$capture_state = () => ({
    		Graph,
    		splitTimes,
    		legNumber,
    		fasestTimeGraphData,
    		runnerNumberGraphData,
    		sortString
    	});

    	$$self.$inject_state = $$props => {
    		if ('splitTimes' in $$props) $$invalidate(2, splitTimes = $$props.splitTimes);
    		if ('legNumber' in $$props) $$invalidate(3, legNumber = $$props.legNumber);
    		if ('fasestTimeGraphData' in $$props) $$invalidate(0, fasestTimeGraphData = $$props.fasestTimeGraphData);
    		if ('runnerNumberGraphData' in $$props) $$invalidate(1, runnerNumberGraphData = $$props.runnerNumberGraphData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*splitTimes, legNumber*/ 12) {
    			{
    				if (splitTimes.routeChoicesStatistics.length !== 0) {
    					const statistics = splitTimes.routeChoicesStatistics[legNumber - 1];
    					const formattedStatistics = Object.keys(statistics).map(routechoiceName => Object.assign(Object.assign({}, statistics[routechoiceName]), { name: routechoiceName }));

    					$$invalidate(0, fasestTimeGraphData = formattedStatistics.map(stat => ({
    						label: stat.name,
    						value: stat.fastestTime,
    						color: stat.color
    					})).sort(sortString));

    					$$invalidate(1, runnerNumberGraphData = formattedStatistics.map(stat => ({
    						label: stat.name,
    						value: stat.numberOfRunners,
    						color: stat.color
    					})).sort(sortString));
    				}
    			}
    		}
    	};

    	return [fasestTimeGraphData, runnerNumberGraphData, splitTimes, legNumber];
    }

    class Statistics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { splitTimes: 2, legNumber: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Statistics",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*splitTimes*/ ctx[2] === undefined && !('splitTimes' in props)) {
    			console.warn("<Statistics> was created without expected prop 'splitTimes'");
    		}

    		if (/*legNumber*/ ctx[3] === undefined && !('legNumber' in props)) {
    			console.warn("<Statistics> was created without expected prop 'legNumber'");
    		}
    	}

    	get splitTimes() {
    		throw new Error("<Statistics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set splitTimes(value) {
    		throw new Error("<Statistics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legNumber() {
    		throw new Error("<Statistics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legNumber(value) {
    		throw new Error("<Statistics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Toggle.svelte generated by Svelte v3.46.4 */

    const file$2 = "src\\components\\Toggle.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let button0;
    	let t0;
    	let t1;
    	let button1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			t0 = text(/*firstLabel*/ ctx[1]);
    			t1 = space();
    			button1 = element("button");
    			t2 = text(/*secondLabel*/ ctx[2]);
    			attr_dev(button0, "class", "first-button svelte-1uksrpc");
    			toggle_class(button0, "not-selected", !/*isFirstValueSelected*/ ctx[0]);
    			add_location(button0, file$2, 7, 2, 146);
    			attr_dev(button1, "class", "second-button svelte-1uksrpc");
    			toggle_class(button1, "not-selected", /*isFirstValueSelected*/ ctx[0]);
    			add_location(button1, file$2, 12, 2, 309);
    			attr_dev(div, "class", "toggle-container svelte-1uksrpc");
    			add_location(div, file$2, 6, 0, 112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, t0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(button1, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*firstLabel*/ 2) set_data_dev(t0, /*firstLabel*/ ctx[1]);

    			if (dirty & /*isFirstValueSelected*/ 1) {
    				toggle_class(button0, "not-selected", !/*isFirstValueSelected*/ ctx[0]);
    			}

    			if (dirty & /*secondLabel*/ 4) set_data_dev(t2, /*secondLabel*/ ctx[2]);

    			if (dirty & /*isFirstValueSelected*/ 1) {
    				toggle_class(button1, "not-selected", /*isFirstValueSelected*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toggle', slots, []);
    	let { isFirstValueSelected } = $$props;
    	let { firstLabel } = $$props;
    	let { secondLabel } = $$props;
    	const writable_props = ['isFirstValueSelected', 'firstLabel', 'secondLabel'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toggle> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, isFirstValueSelected = true);
    	const click_handler_1 = () => $$invalidate(0, isFirstValueSelected = false);

    	$$self.$$set = $$props => {
    		if ('isFirstValueSelected' in $$props) $$invalidate(0, isFirstValueSelected = $$props.isFirstValueSelected);
    		if ('firstLabel' in $$props) $$invalidate(1, firstLabel = $$props.firstLabel);
    		if ('secondLabel' in $$props) $$invalidate(2, secondLabel = $$props.secondLabel);
    	};

    	$$self.$capture_state = () => ({
    		isFirstValueSelected,
    		firstLabel,
    		secondLabel
    	});

    	$$self.$inject_state = $$props => {
    		if ('isFirstValueSelected' in $$props) $$invalidate(0, isFirstValueSelected = $$props.isFirstValueSelected);
    		if ('firstLabel' in $$props) $$invalidate(1, firstLabel = $$props.firstLabel);
    		if ('secondLabel' in $$props) $$invalidate(2, secondLabel = $$props.secondLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isFirstValueSelected, firstLabel, secondLabel, click_handler, click_handler_1];
    }

    class Toggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			isFirstValueSelected: 0,
    			firstLabel: 1,
    			secondLabel: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toggle",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isFirstValueSelected*/ ctx[0] === undefined && !('isFirstValueSelected' in props)) {
    			console.warn("<Toggle> was created without expected prop 'isFirstValueSelected'");
    		}

    		if (/*firstLabel*/ ctx[1] === undefined && !('firstLabel' in props)) {
    			console.warn("<Toggle> was created without expected prop 'firstLabel'");
    		}

    		if (/*secondLabel*/ ctx[2] === undefined && !('secondLabel' in props)) {
    			console.warn("<Toggle> was created without expected prop 'secondLabel'");
    		}
    	}

    	get isFirstValueSelected() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFirstValueSelected(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get firstLabel() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set firstLabel(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondLabel() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondLabel(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function selectHack(iframe, selectElementId, selectElementValue) {
        const select = iframe.contentDocument.getElementById(selectElementId);
        select.value = selectElementValue;
        select.dispatchEvent(new Event("change"));
    }

    /*
    let rerunFileSelector = document.getElementById('2DRerun-file-selector')
    let splitsFileSelector = document.getElementById('splits-file-selector')
    let gpxFileSelector = document.getElementById('gpx-file-selector')
    let runnerSelectContainer = document.getElementById('runner-select-container')
    let runnerSelect = document.getElementById('runner-select')
    let detectRoutechoicesButton = document.getElementById('detect-routechoices-button')
    let routechoicesTable = document.getElementById('routechoices-table')

    let courseObject
    let gpx
    let gpxArray
    let runner
    let detectedRoutechoices = [] // Problem with synchronisation of split times and GPX, should
    // try to compute my own spli times from GPX and course coords

    let classResult

    rerunFileSelector.addEventListener('change', (event) => {
        let jsonFile = event.target.files[0]
        let reader = new FileReader()

        reader.onload = function (e) {
            let readJson = e.target.result
            courseObject = attributeRoutechoicesToLegs(JSON.parse(readJson))
        }

        reader.readAsText(jsonFile);
    })

    splitsFileSelector.addEventListener('change', (event) => {
        let xmlFile = event.target.files[0]
        let reader = new FileReader()

        reader.onload = function (e) {
            let readXml = e.target.result
            let parser = new DOMParser()
            let xmlDoc = parser.parseFromString(readXml, "application/xml")
            let classResults = xmlDoc.querySelectorAll('ClassResult')
            classResult = classResults[0]
            loadSplits()
            calculateSplits()
        }

        reader.readAsText(xmlFile);
    })

    gpxFileSelector.addEventListener('change', (event) => {
        let xmlFile = event.target.files[0]
        let reader = new FileReader()

        reader.onload = function (e) {
            let readXml = e.target.result
            let parser = new DOMParser()
            gpx = parser.parseFromString(readXml, "application/xml")
            gpxArray = gpxToGpxArray(gpx)
            selectRunner()
        }

        reader.readAsText(xmlFile);
    })

    const selectRunner = () => {
        runnerSelectContainer.classList.remove('w3-hide')

        if (splits) {
            splits.runners.forEach(runner => {
                // Create options in classSelect
                let option = document.createElement('option')
                option.value = runner.pk
                option.innerHTML = runner.firstName + ' ' + runner.lastName
                runnerSelect.appendChild(option)
            })
        
            runnerSelect.addEventListener('change', () => {
                let runnerPk = Number(runnerSelect.options[runnerSelect.selectedIndex].value)
                runner = splits.runners.find(runner => runner.pk === runnerPk)
            })
        }
    }

    detectRoutechoicesButton.addEventListener('click', () => {
        // Correct startTime
        correctedStartTime = timeToArray(runner.startTime + 'Z')
        correctedStartTime[2] -= 1
        correctedStartTime[3] += 7
        correctedStartTime[4] += 30
        runner.startTime = arrayToTime(correctedStartTime)
        
        runner.legs.forEach((leg, index) => {
            let startTime

            if (index === 0) {
                startTime = runner.startTime
            } else {
                startTime = addSecondsToTime(runner.startTime, runner.legs[index - 1].timeOverall)
            }

            let finishTime = addSecondsToTime(runner.startTime, leg.timeOverall)
            let cutGpxArray = cutGpxRemoveTimes(gpxArray, startTime, finishTime)
            let legNumber = index + 1
            let routechoices = prepareRoutechoices(courseObject, legNumber)
            let detectedRoutechoice = null
            //console.log(startTime, finishTime, cutGpxArray)

            if (routechoices.length !== 0) {
                detectedRoutechoice = detectRoutechoice(cutGpxArray, routechoices)
            }

            detectedRoutechoices.push({
                legNumber: legNumber,
                detectedRoutechoice: detectedRoutechoice,
            })
        })

        buildRoutechoicesTable(detectedRoutechoices, routechoicesTable)
    })

    const buildRoutechoicesTable = (data, table) => {
        data.forEach(routechoice => {
            let tr = document.createElement('tr')
            let legTd = document.createElement('td')
            legTd.innerHTML = String(routechoice.legNumber)
            let routechoiceTd = document.createElement('td')
            routechoiceTd.innerHTML = routechoice.detectedRoutechoice
            tr.appendChild(legTd)
            tr.appendChild(routechoiceTd)
            tbody = table.querySelector('tbody')
            tbody.appendChild(tr)
        })
    }
    */
    const detectRunnersRoutechoices = (runners, courseObject, routes) => {
        // splitsObject is Routechoice-DB like splits object
        // routechoices is an array resulting to a GET request on RDB API
        courseObject = attributeRoutechoicesToLegs(courseObject);
        runners.forEach((runner) => {
            const route = routes[runner.rerun2dRouteIndex];
            if (route) {
                const routeArray = route.latarray.map((lat, index) => [
                    lat,
                    route.lngarray[index],
                    route.timearray[index],
                ]);
                runner.legs.forEach((leg, index) => {
                    const raceStartTime = new Date(runner.startTime);
                    const raceStartTimeInSeconds = raceStartTime.getTime() / 1000;
                    console.log(raceStartTimeInSeconds);
                    const startTime = index === 0
                        ? raceStartTimeInSeconds
                        : raceStartTimeInSeconds + runner.legs[index - 1].timeOverall;
                    const finishTime = raceStartTimeInSeconds + leg.timeOverall;
                    let cutGpxArray = cutRouteArrayRemoveTimes(routeArray, startTime, finishTime);
                    let legNumber = index + 1;
                    let routechoices = prepareRoutechoices(courseObject, legNumber);
                    leg.routeChoice =
                        routechoices.length !== 0
                            ? detectRoutechoice(cutGpxArray, routechoices)
                            : null;
                });
            }
        });
        return runners;
    };
    const distancePointToSegment = (point, extremity1, extremity2) => {
        // The 3 parameters are arrays of 2 number: [x, y]
        let r = dotProduct([extremity2[0] - extremity1[0], extremity2[1] - extremity1[1]], [point[0] - extremity1[0], point[1] - extremity1[1]]) /
            Math.pow(magnitude([extremity2[0] - extremity1[0], extremity2[1] - extremity1[1]]), 2);
        let distance;
        if (r < 0) {
            distance = magnitude([point[0] - extremity1[0], point[1] - extremity1[1]]);
        }
        else if (r > 1) {
            distance = magnitude([extremity2[0] - point[0], extremity2[1] - point[1]]);
        }
        else {
            distance = Math.sqrt(Math.pow(magnitude([point[0] - extremity1[0], point[1] - extremity1[1]]), 2) -
                Math.pow(r *
                    magnitude([
                        extremity2[0] - extremity1[0],
                        extremity2[1] - extremity1[1],
                    ]), 2));
        }
        return distance;
    };
    const distancePointToPolyline = (point, polyline) => {
        // Initiallize distance with the distance to the fist point of the polyline
        let distance = magnitude([
            point[0] - polyline[0][0],
            point[1] - polyline[0][1],
        ]);
        for (let i = 1; i < polyline.length; i++) {
            const d = distancePointToSegment(point, polyline[i - 1], polyline[i]);
            if (d < distance) {
                distance = d;
            }
        }
        return distance;
    };
    const distanceGPXToPolyline = (GPXArray, polyline) => {
        // GPXArray and polyline are arrays of vectors
        let distance = 0;
        GPXArray.forEach((point) => {
            distance += distancePointToPolyline(point, polyline);
        });
        return distance;
    };
    const detectRoutechoice = (GPXArray, routechoices) => {
        // Initiallisation with first routechoice
        let routechoiceName = routechoices[0].name;
        let routechoiceColor = routechoices[0].color;
        let distance = distanceGPXToPolyline(GPXArray, routechoices[0].points);
        routechoices.forEach((routechoice) => {
            let d = distanceGPXToPolyline(GPXArray, routechoice.points);
            if (d < distance) {
                distance = d;
                routechoiceName = routechoice.name;
                routechoiceColor = routechoice.color;
            }
        });
        return {
            name: routechoiceName,
            color: routechoiceColor,
        };
    };
    const cutRouteArrayRemoveTimes = (routeArray, startTime, finishTime) => {
        // Cut GPX and remove times
        return routeArray
            .filter((point) => point[2] > startTime)
            .filter((point) => point[2] < finishTime)
            .map((point) => [point[0], point[1]]);
    };
    const prepareRoutechoices = (courseObject, legNumber) => {
        // Prepare routechoices object for findBestRoutechoice() function
        let routechoices = courseObject.tags.filter((tag) => tag.legNumber === legNumber);
        let preparedRoutechoices = routechoices.map((routechoice) => ({
            name: routechoice.name,
            legNumber: routechoices.legNumber,
            points: routechoice.points.map((point) => stringToArray(point)),
            color: routechoice.color,
        }));
        return preparedRoutechoices;
    };
    const attributeRoutechoicesToLegs = (courseObject) => {
        let object = Object.assign({}, courseObject);
        object.tags.forEach((tag) => {
            let dist = distance([tag.x, tag.y], stringToArray(object.coursecoords[0]));
            let legNumber = 0;
            object.coursecoords.forEach((coursecoord, index) => {
                let d = distance([tag.x, tag.y], stringToArray(coursecoord));
                if (d < dist) {
                    dist = d;
                    legNumber = index;
                }
            });
            tag.legNumber = legNumber;
        });
        return object;
    };
    const stringToArray = (string) => {
        // Convert a vector from a string notation like "x,y" to a array like [x, y]
        return string.split(",").map((x) => Number(x));
    };
    const magnitude = (vector) => {
        return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
    };
    const dotProduct = (vector1, vector2) => {
        return vector1[0] * vector2[0] + vector1[1] * vector2[1];
    };
    const substractVectors = (vector1, vector2) => {
        return [vector1[0] - vector2[0], vector1[1] - vector2[1]];
    };
    const distance = (vector1, vector2) => {
        return magnitude(substractVectors(vector1, vector2));
    };

    /* src\routes\Course.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;

    const file$1 = "src\\routes\\Course.svelte";

    // (57:0) {#if isLoadSplitsDialogOpen}
    function create_if_block_4(ctx) {
    	let dialog;
    	let current;

    	dialog = new Dialog({
    			props: {
    				$$slots: {
    					content: [create_content_slot_1],
    					title: [create_title_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dialog.$on("closeDialog", /*closeDialog_handler*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialog_changes = {};

    			if (dirty & /*$$scope, mapviewer, splitTimes, isLoadSplitsDialogOpen*/ 2097225) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(57:0) {#if isLoadSplitsDialogOpen}",
    		ctx
    	});

    	return block;
    }

    // (59:4) 
    function create_title_slot_1(ctx) {
    	let h3;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Load split times";
    			attr_dev(h3, "slot", "title");
    			add_location(h3, file$1, 58, 4, 2653);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot_1.name,
    		type: "slot",
    		source: "(59:4) ",
    		ctx
    	});

    	return block;
    }

    // (61:4) 
    function create_content_slot_1(ctx) {
    	let loadsplittimes;
    	let updating_savedSplitTimes;
    	let current;

    	function loadsplittimes_savedSplitTimes_binding(value) {
    		/*loadsplittimes_savedSplitTimes_binding*/ ctx[12](value);
    	}

    	let loadsplittimes_props = {
    		slot: "content",
    		mapviewer: /*mapviewer*/ ctx[6]
    	};

    	if (/*splitTimes*/ ctx[3] !== void 0) {
    		loadsplittimes_props.savedSplitTimes = /*splitTimes*/ ctx[3];
    	}

    	loadsplittimes = new LoadSplitTimes({
    			props: loadsplittimes_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(loadsplittimes, 'savedSplitTimes', loadsplittimes_savedSplitTimes_binding));
    	loadsplittimes.$on("close", /*close_handler*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(loadsplittimes.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadsplittimes, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const loadsplittimes_changes = {};
    			if (dirty & /*mapviewer*/ 64) loadsplittimes_changes.mapviewer = /*mapviewer*/ ctx[6];

    			if (!updating_savedSplitTimes && dirty & /*splitTimes*/ 8) {
    				updating_savedSplitTimes = true;
    				loadsplittimes_changes.savedSplitTimes = /*splitTimes*/ ctx[3];
    				add_flush_callback(() => updating_savedSplitTimes = false);
    			}

    			loadsplittimes.$set(loadsplittimes_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadsplittimes.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadsplittimes.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadsplittimes, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot_1.name,
    		type: "slot",
    		source: "(61:4) ",
    		ctx
    	});

    	return block;
    }

    // (70:0) {#if isSplitsTableDialogOpen}
    function create_if_block_3(ctx) {
    	let dialog;
    	let current;

    	dialog = new Dialog({
    			props: {
    				$$slots: {
    					content: [create_content_slot],
    					title: [create_title_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dialog.$on("closeDialog", /*closeDialog_handler_1*/ ctx[15]);

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialog_changes = {};

    			if (dirty & /*$$scope, splitTimes*/ 2097160) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(70:0) {#if isSplitsTableDialogOpen}",
    		ctx
    	});

    	return block;
    }

    // (72:4) 
    function create_title_slot(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Split times";
    			attr_dev(h1, "slot", "title");
    			add_location(h1, file$1, 71, 4, 2989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot.name,
    		type: "slot",
    		source: "(72:4) ",
    		ctx
    	});

    	return block;
    }

    // (74:4) 
    function create_content_slot(ctx) {
    	let splittimestable;
    	let current;

    	splittimestable = new SplitTimesTable({
    			props: {
    				slot: "content",
    				splitTimes: /*splitTimes*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(splittimestable.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(splittimestable, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const splittimestable_changes = {};
    			if (dirty & /*splitTimes*/ 8) splittimestable_changes.splitTimes = /*splitTimes*/ ctx[3];
    			splittimestable.$set(splittimestable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(splittimestable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(splittimestable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(splittimestable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(74:4) ",
    		ctx
    	});

    	return block;
    }

    // (79:2) {#if showSidePanel}
    function create_if_block(ctx) {
    	let aside;
    	let details;
    	let summary;
    	let span;
    	let svg;
    	let path;
    	let t0;
    	let t1;
    	let ul;
    	let li0;
    	let button0;
    	let t3;
    	let li1;
    	let button1;
    	let t5;
    	let li2;
    	let button2;
    	let t7;
    	let li3;
    	let button3;
    	let t9;
    	let li4;
    	let button4;
    	let t11;
    	let toggle;
    	let updating_isFirstValueSelected;
    	let t12;
    	let t13;
    	let current;
    	let mounted;
    	let dispose;

    	function toggle_isFirstValueSelected_binding(value) {
    		/*toggle_isFirstValueSelected_binding*/ ctx[17](value);
    	}

    	let toggle_props = {
    		firstLabel: "Splits",
    		secondLabel: "Graph"
    	};

    	if (/*isInSplitMode*/ ctx[2] !== void 0) {
    		toggle_props.isFirstValueSelected = /*isInSplitMode*/ ctx[2];
    	}

    	toggle = new Toggle({ props: toggle_props, $$inline: true });
    	binding_callbacks.push(() => bind(toggle, 'isFirstValueSelected', toggle_isFirstValueSelected_binding));
    	let if_block0 = !/*isInSplitMode*/ ctx[2] && create_if_block_2(ctx);
    	let if_block1 = /*isInSplitMode*/ ctx[2] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			details = element("details");
    			summary = element("summary");
    			span = element("span");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = text("Options");
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			button0 = element("button");
    			button0.textContent = "Load course";
    			t3 = space();
    			li1 = element("li");
    			button1 = element("button");
    			button1.textContent = "Load routechoices";
    			t5 = space();
    			li2 = element("li");
    			button2 = element("button");
    			button2.textContent = "Load split times";
    			t7 = space();
    			li3 = element("li");
    			button3 = element("button");
    			button3.textContent = "Detect routechoices";
    			t9 = space();
    			li4 = element("li");
    			button4 = element("button");
    			button4.textContent = "Toggle 2D Rerun";
    			t11 = space();
    			create_component(toggle.$$.fragment);
    			t12 = space();
    			if (if_block0) if_block0.c();
    			t13 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(path, "d", "M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z");
    			add_location(path, file$1, 84, 183, 3518);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			attr_dev(svg, "class", "svelte-1398d2s");
    			add_location(svg, file$1, 83, 13, 3272);
    			attr_dev(span, "class", "svelte-1398d2s");
    			add_location(span, file$1, 82, 11, 3252);
    			attr_dev(summary, "class", "icon-button svelte-1398d2s");
    			add_location(summary, file$1, 81, 8, 3211);
    			attr_dev(button0, "class", "svelte-1398d2s");
    			add_location(button0, file$1, 91, 14, 5098);
    			add_location(li0, file$1, 91, 10, 5094);
    			attr_dev(button1, "class", "svelte-1398d2s");
    			add_location(button1, file$1, 93, 14, 5149);
    			add_location(li1, file$1, 93, 10, 5145);
    			attr_dev(button2, "class", "svelte-1398d2s");
    			add_location(button2, file$1, 96, 12, 5220);
    			add_location(li2, file$1, 95, 10, 5202);
    			attr_dev(button3, "class", "svelte-1398d2s");
    			add_location(button3, file$1, 102, 12, 5381);
    			add_location(li3, file$1, 101, 10, 5363);
    			attr_dev(button4, "class", "svelte-1398d2s");
    			add_location(button4, file$1, 106, 12, 5496);
    			add_location(li4, file$1, 105, 10, 5478);
    			attr_dev(ul, "class", "svelte-1398d2s");
    			add_location(ul, file$1, 90, 8, 5078);
    			attr_dev(details, "class", "options svelte-1398d2s");
    			add_location(details, file$1, 80, 6, 3176);
    			attr_dev(aside, "class", "svelte-1398d2s");
    			add_location(aside, file$1, 79, 4, 3161);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, details);
    			append_dev(details, summary);
    			append_dev(summary, span);
    			append_dev(span, svg);
    			append_dev(svg, path);
    			append_dev(span, t0);
    			append_dev(details, t1);
    			append_dev(details, ul);
    			append_dev(ul, li0);
    			append_dev(li0, button0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, button1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, button2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, button3);
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			append_dev(li4, button4);
    			append_dev(aside, t11);
    			mount_component(toggle, aside, null);
    			append_dev(aside, t12);
    			if (if_block0) if_block0.m(aside, null);
    			append_dev(aside, t13);
    			if (if_block1) if_block1.m(aside, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button2, "click", /*click_handler*/ ctx[16], false, false, false),
    					listen_dev(button3, "click", /*detectRoutechoices*/ ctx[11], false, false, false),
    					listen_dev(button4, "click", /*togle2dRerunPanel*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const toggle_changes = {};

    			if (!updating_isFirstValueSelected && dirty & /*isInSplitMode*/ 4) {
    				updating_isFirstValueSelected = true;
    				toggle_changes.isFirstValueSelected = /*isInSplitMode*/ ctx[2];
    				add_flush_callback(() => updating_isFirstValueSelected = false);
    			}

    			toggle.$set(toggle_changes);

    			if (!/*isInSplitMode*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*isInSplitMode*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(aside, t13);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*isInSplitMode*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*isInSplitMode*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(aside, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toggle.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toggle.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_component(toggle);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(79:2) {#if showSidePanel}",
    		ctx
    	});

    	return block;
    }

    // (124:6) {#if !isInSplitMode}
    function create_if_block_2(ctx) {
    	let section;
    	let statistics;
    	let current;

    	statistics = new Statistics({
    			props: {
    				legNumber: /*legNumber*/ ctx[4],
    				splitTimes: /*splitTimes*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(statistics.$$.fragment);
    			attr_dev(section, "class", "routechoices-graph svelte-1398d2s");
    			add_location(section, file$1, 124, 8, 5959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(statistics, section, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const statistics_changes = {};
    			if (dirty & /*legNumber*/ 16) statistics_changes.legNumber = /*legNumber*/ ctx[4];
    			if (dirty & /*splitTimes*/ 8) statistics_changes.splitTimes = /*splitTimes*/ ctx[3];
    			statistics.$set(statistics_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(statistics.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(statistics.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(statistics);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(124:6) {#if !isInSplitMode}",
    		ctx
    	});

    	return block;
    }

    // (130:6) {#if isInSplitMode}
    function create_if_block_1(ctx) {
    	let section;
    	let legsplittimestable;
    	let current;

    	legsplittimestable = new LegSplitTimesTable({
    			props: {
    				legNumber: /*legNumber*/ ctx[4],
    				splitTimes: /*splitTimes*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(legsplittimestable.$$.fragment);
    			attr_dev(section, "class", "leg-split-times-table-container svelte-1398d2s");
    			add_location(section, file$1, 130, 8, 6118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(legsplittimestable, section, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const legsplittimestable_changes = {};
    			if (dirty & /*legNumber*/ 16) legsplittimestable_changes.legNumber = /*legNumber*/ ctx[4];
    			if (dirty & /*splitTimes*/ 8) legsplittimestable_changes.splitTimes = /*splitTimes*/ ctx[3];
    			legsplittimestable.$set(legsplittimestable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(legsplittimestable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(legsplittimestable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(legsplittimestable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(130:6) {#if isInSplitMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t0;
    	let t1;
    	let main;
    	let t2;
    	let iframe_1;
    	let iframe_1_src_value;
    	let t3;
    	let div;
    	let button0;
    	let svg0;
    	let path0;
    	let t4;
    	let legselector;
    	let updating_selectedLeg;
    	let t5;
    	let button1;
    	let svg1;
    	let path1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*isLoadSplitsDialogOpen*/ ctx[0] && create_if_block_4(ctx);
    	let if_block1 = /*isSplitsTableDialogOpen*/ ctx[1] && create_if_block_3(ctx);
    	let if_block2 = /*showSidePanel*/ ctx[7] && create_if_block(ctx);

    	function legselector_selectedLeg_binding(value) {
    		/*legselector_selectedLeg_binding*/ ctx[18](value);
    	}

    	let legselector_props = { numberOfLegs: /*numberOfContols*/ ctx[5] };

    	if (/*legNumber*/ ctx[4] !== void 0) {
    		legselector_props.selectedLeg = /*legNumber*/ ctx[4];
    	}

    	legselector = new LegSelector({ props: legselector_props, $$inline: true });
    	binding_callbacks.push(() => bind(legselector, 'selectedLeg', legselector_selectedLeg_binding));
    	legselector.$on("legChange", /*propagateLegChangeTo2DRerun*/ ctx[10]);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			main = element("main");
    			if (if_block2) if_block2.c();
    			t2 = space();
    			iframe_1 = element("iframe");
    			t3 = space();
    			div = element("div");
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t4 = space();
    			create_component(legselector.$$.fragment);
    			t5 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			attr_dev(iframe_1, "id", "2d-rerun");
    			attr_dev(iframe_1, "title", "2d-rerun");
    			if (!src_url_equal(iframe_1.src, iframe_1_src_value = "2d-rerun/2d-rerun.html")) attr_dev(iframe_1, "src", iframe_1_src_value);
    			attr_dev(iframe_1, "class", "svelte-1398d2s");
    			add_location(iframe_1, file$1, 137, 2, 6288);
    			attr_dev(path0, "d", "M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z");
    			add_location(path0, file$1, 147, 177, 6712);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 576 512");
    			attr_dev(svg0, "class", "svelte-1398d2s");
    			add_location(svg0, file$1, 146, 6, 6472);
    			attr_dev(button0, "class", "mobile svelte-1398d2s");
    			add_location(button0, file$1, 145, 4, 6441);
    			attr_dev(path1, "d", "M64 400C64 408.8 71.16 416 80 416H480C497.7 416 512 430.3 512 448C512 465.7 497.7 480 480 480H80C35.82 480 0 444.2 0 400V64C0 46.33 14.33 32 32 32C49.67 32 64 46.33 64 64V400zM342.6 278.6C330.1 291.1 309.9 291.1 297.4 278.6L240 221.3L150.6 310.6C138.1 323.1 117.9 323.1 105.4 310.6C92.88 298.1 92.88 277.9 105.4 265.4L217.4 153.4C229.9 140.9 250.1 140.9 262.6 153.4L320 210.7L425.4 105.4C437.9 92.88 458.1 92.88 470.6 105.4C483.1 117.9 483.1 138.1 470.6 150.6L342.6 278.6z");
    			add_location(path1, file$1, 161, 177, 8044);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 512 512");
    			attr_dev(svg1, "class", "svelte-1398d2s");
    			add_location(svg1, file$1, 160, 6, 7804);
    			attr_dev(button1, "class", "mobile svelte-1398d2s");
    			add_location(button1, file$1, 159, 4, 7723);
    			attr_dev(div, "class", "control-bar svelte-1398d2s");
    			add_location(div, file$1, 144, 2, 6410);
    			attr_dev(main, "class", "course-container svelte-1398d2s");
    			add_location(main, file$1, 77, 0, 3101);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			if (if_block2) if_block2.m(main, null);
    			append_dev(main, t2);
    			append_dev(main, iframe_1);
    			append_dev(main, t3);
    			append_dev(main, div);
    			append_dev(div, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div, t4);
    			mount_component(legselector, div, null);
    			append_dev(div, t5);
    			append_dev(div, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(iframe_1, "load", /*iframeLoaded*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isLoadSplitsDialogOpen*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*isLoadSplitsDialogOpen*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*isSplitsTableDialogOpen*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*isSplitsTableDialogOpen*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*showSidePanel*/ ctx[7]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*showSidePanel*/ 128) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(main, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const legselector_changes = {};
    			if (dirty & /*numberOfContols*/ 32) legselector_changes.numberOfLegs = /*numberOfContols*/ ctx[5];

    			if (!updating_selectedLeg && dirty & /*legNumber*/ 16) {
    				updating_selectedLeg = true;
    				legselector_changes.selectedLeg = /*legNumber*/ ctx[4];
    				add_flush_callback(() => updating_selectedLeg = false);
    			}

    			legselector.$set(legselector_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(legselector.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(legselector.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			if (if_block2) if_block2.d();
    			destroy_component(legselector);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Course', slots, []);
    	let isLoadSplitsDialogOpen = false;
    	let isSplitsTableDialogOpen = false;
    	let isInSplitMode = true;
    	let splitTimes = { runners: [], routeChoicesStatistics: [] };
    	let legNumber = 1;
    	let iframe;
    	let numberOfContols;
    	let mapviewer;
    	let showSidePanel = true;

    	const iframeLoaded = () => {
    		iframe = document.getElementById("2d-rerun");
    		iframe.contentWindow.mapviewer.loadseu("http://www.tulospalvelu.fi/gps/", "logatec_3LENA");

    		fetch("course-tags.json").then(res => res.json()).then(data => {
    			iframe.contentWindow.mapviewer.tags = data.tags;
    			iframe.contentWindow.mapviewer.coursecoords = data.coursecoords;
    			iframe.contentWindow.mapviewer.otechinfo = data.otechinfo;
    			iframe.contentWindow.mapviewer.request_redraw();
    			iframe.contentWindow.mapviewer.update_routediv();
    			$$invalidate(6, mapviewer = iframe.contentWindow.mapviewer);
    			console.log(mapviewer);
    			$$invalidate(5, numberOfContols = data.coursecoords.length - 1);
    			iframe.contentDocument.getElementById("shown").click();
    			selectHack(iframe, "selectmode", "analyzecourse");
    			selectHack(iframe, "showtagsselect", "1");
    			setTimeout(propagateLegChangeTo2DRerun, 3000);
    		});
    	};

    	const togle2dRerunPanel = () => {
    		if (iframe) {
    			let rightmenu = iframe.contentDocument.getElementById("rightmenu");
    			rightmenu.style.display = rightmenu.style.display === "block" ? "none" : "block";
    		}
    	};

    	const propagateLegChangeTo2DRerun = () => {
    		selectHack(iframe, "selectmode", "analyzecourse");
    		iframe.contentDocument.getElementById(`ac-${legNumber}`).click();
    	};

    	const detectRoutechoices = () => {
    		$$invalidate(3, splitTimes.runners = detectRunnersRoutechoices(splitTimes.runners, mapviewer, mapviewer.routes), splitTimes);
    		splitTimes.computeRoutechoicesStatistics();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Course> was created with unknown prop '${key}'`);
    	});

    	function loadsplittimes_savedSplitTimes_binding(value) {
    		splitTimes = value;
    		$$invalidate(3, splitTimes);
    	}

    	const close_handler = () => $$invalidate(0, isLoadSplitsDialogOpen = false);
    	const closeDialog_handler = () => $$invalidate(0, isLoadSplitsDialogOpen = false);
    	const closeDialog_handler_1 = () => $$invalidate(1, isSplitsTableDialogOpen = false);
    	const click_handler = () => $$invalidate(0, isLoadSplitsDialogOpen = true);

    	function toggle_isFirstValueSelected_binding(value) {
    		isInSplitMode = value;
    		$$invalidate(2, isInSplitMode);
    	}

    	function legselector_selectedLeg_binding(value) {
    		legNumber = value;
    		$$invalidate(4, legNumber);
    	}

    	const click_handler_1 = () => $$invalidate(7, showSidePanel = !showSidePanel);

    	$$self.$capture_state = () => ({
    		Dialog,
    		LegSelector,
    		LoadSplitTimes,
    		LegSplitTimesTable,
    		SplitTimesTable,
    		Statistics,
    		Toggle,
    		selectHack,
    		detectRunnersRoutechoices,
    		isLoadSplitsDialogOpen,
    		isSplitsTableDialogOpen,
    		isInSplitMode,
    		splitTimes,
    		legNumber,
    		iframe,
    		numberOfContols,
    		mapviewer,
    		showSidePanel,
    		iframeLoaded,
    		togle2dRerunPanel,
    		propagateLegChangeTo2DRerun,
    		detectRoutechoices
    	});

    	$$self.$inject_state = $$props => {
    		if ('isLoadSplitsDialogOpen' in $$props) $$invalidate(0, isLoadSplitsDialogOpen = $$props.isLoadSplitsDialogOpen);
    		if ('isSplitsTableDialogOpen' in $$props) $$invalidate(1, isSplitsTableDialogOpen = $$props.isSplitsTableDialogOpen);
    		if ('isInSplitMode' in $$props) $$invalidate(2, isInSplitMode = $$props.isInSplitMode);
    		if ('splitTimes' in $$props) $$invalidate(3, splitTimes = $$props.splitTimes);
    		if ('legNumber' in $$props) $$invalidate(4, legNumber = $$props.legNumber);
    		if ('iframe' in $$props) iframe = $$props.iframe;
    		if ('numberOfContols' in $$props) $$invalidate(5, numberOfContols = $$props.numberOfContols);
    		if ('mapviewer' in $$props) $$invalidate(6, mapviewer = $$props.mapviewer);
    		if ('showSidePanel' in $$props) $$invalidate(7, showSidePanel = $$props.showSidePanel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isLoadSplitsDialogOpen,
    		isSplitsTableDialogOpen,
    		isInSplitMode,
    		splitTimes,
    		legNumber,
    		numberOfContols,
    		mapviewer,
    		showSidePanel,
    		iframeLoaded,
    		togle2dRerunPanel,
    		propagateLegChangeTo2DRerun,
    		detectRoutechoices,
    		loadsplittimes_savedSplitTimes_binding,
    		close_handler,
    		closeDialog_handler,
    		closeDialog_handler_1,
    		click_handler,
    		toggle_isFirstValueSelected_binding,
    		legselector_selectedLeg_binding,
    		click_handler_1
    	];
    }

    class Course extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Course",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    // (33:24) <Link to="about">
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("About");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(33:24) <Link to=\\\"about\\\">",
    		ctx
    	});

    	return block;
    }

    // (34:24) <Link to="login">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Login");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(34:24) <Link to=\\\"login\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:24) <Link to="courses">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Courses");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(35:24) <Link to=\\\"courses\\\">",
    		ctx
    	});

    	return block;
    }

    // (47:16) <Link to="about">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("About");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(47:16) <Link to=\\\"about\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:16) <Link to="login">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Login");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(48:16) <Link to=\\\"login\\\">",
    		ctx
    	});

    	return block;
    }

    // (49:16) <Link to="courses">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Courses");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(49:16) <Link to=\\\"courses\\\">",
    		ctx
    	});

    	return block;
    }

    // (57:2) <Route path="/">
    function create_default_slot_3(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(57:2) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (58:2) <Route path="login">
    function create_default_slot_2(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(58:2) <Route path=\\\"login\\\">",
    		ctx
    	});

    	return block;
    }

    // (59:2) <Route path="courses">
    function create_default_slot_1(ctx) {
    	let course;
    	let current;
    	course = new Course({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(course.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(course, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(course.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(course.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(course, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(59:2) <Route path=\\\"courses\\\">",
    		ctx
    	});

    	return block;
    }

    // (9:0) <Router {url}>
    function create_default_slot(ctx) {
    	let nav;
    	let ul0;
    	let li0;
    	let a;
    	let svg0;
    	let g;
    	let path0;
    	let t0;
    	let t1;
    	let ul2;
    	let li1;
    	let link0;
    	let t2;
    	let li2;
    	let link1;
    	let t3;
    	let li3;
    	let link2;
    	let t4;
    	let li7;
    	let details;
    	let summary;
    	let svg1;
    	let path1;
    	let t5;
    	let ul1;
    	let li4;
    	let link3;
    	let t6;
    	let li5;
    	let link4;
    	let t7;
    	let li6;
    	let link5;
    	let t8;
    	let route0;
    	let t9;
    	let route1;
    	let t10;
    	let route2;
    	let t11;
    	let route3;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "about",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "login",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "courses",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link({
    			props: {
    				to: "about",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link({
    			props: {
    				to: "login",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link({
    			props: {
    				to: "courses",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route({
    			props: { path: "about", component: About },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "login",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "courses",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul0 = element("ul");
    			li0 = element("li");
    			a = element("a");
    			svg0 = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			t0 = text("Routechoice DB");
    			t1 = space();
    			ul2 = element("ul");
    			li1 = element("li");
    			create_component(link0.$$.fragment);
    			t2 = space();
    			li2 = element("li");
    			create_component(link1.$$.fragment);
    			t3 = space();
    			li3 = element("li");
    			create_component(link2.$$.fragment);
    			t4 = space();
    			li7 = element("li");
    			details = element("details");
    			summary = element("summary");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t5 = space();
    			ul1 = element("ul");
    			li4 = element("li");
    			create_component(link3.$$.fragment);
    			t6 = space();
    			li5 = element("li");
    			create_component(link4.$$.fragment);
    			t7 = space();
    			li6 = element("li");
    			create_component(link5.$$.fragment);
    			t8 = space();
    			create_component(route0.$$.fragment);
    			t9 = space();
    			create_component(route1.$$.fragment);
    			t10 = space();
    			create_component(route2.$$.fragment);
    			t11 = space();
    			create_component(route3.$$.fragment);
    			attr_dev(path0, "id", "path0");
    			attr_dev(path0, "d", "M44.834 8.642 C -9.236 15.598,-16.592 90.812,35.081 108.357 C 62.086 117.526,92.795 101.206,100.469 73.606 L 101.828 68.717 204.625 68.929 L 307.422 69.141 314.844 71.720 C 372.485 91.749,370.139 167.252,311.328 184.854 C 306.948 186.165,299.374 186.288,195.703 186.728 C 74.030 187.244,81.373 186.948,68.180 191.879 C -3.555 218.693,1.397 317.718,75.491 338.101 L 83.203 340.223 158.550 340.446 L 233.897 340.670 215.082 359.593 C 204.734 370.000,196.019 379.337,195.716 380.341 C 193.785 386.730,200.102 393.064,206.641 391.298 C 211.139 390.083,263.300 336.904,263.824 332.999 C 264.468 328.199,263.604 327.172,235.005 298.739 C 205.985 269.888,204.826 269.097,198.916 274.134 C 192.068 279.969,193.526 282.731,214.748 304.124 L 233.176 322.702 158.580 322.484 L 83.984 322.266 78.516 320.428 C 19.492 300.595,20.273 224.977,79.688 206.899 L 85.547 205.116 196.484 204.668 C 316.415 204.184,308.429 204.465,321.484 200.267 C 394.585 176.762,390.757 73.892,316.016 53.327 L 308.203 51.177 204.943 50.960 L 101.684 50.743 100.813 46.682 C 95.722 22.945,69.924 5.415,44.834 8.642 M57.120 26.567 C 83.498 31.490,93.480 64.209,74.419 83.270 C 55.379 102.310,22.242 91.240,18.093 64.453 C 14.614 41.995,34.799 22.401,57.120 26.567 M337.500 281.632 C 305.844 288.752,288.466 324.933,302.668 354.152 C 321.243 392.369,376.462 392.648,394.793 354.618 C 413.613 315.574,379.546 272.174,337.500 281.632 M361.206 300.719 C 383.881 309.619,389.474 339.193,371.662 356.005 C 350.403 376.072,315.678 360.926,315.633 331.568 C 315.598 308.426,339.545 292.216,361.206 300.719 ");
    			add_location(path0, file, 21, 15, 652);
    			attr_dev(g, "id", "svgg");
    			add_location(g, file, 20, 13, 624);
    			attr_dev(svg0, "id", "svg");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg0, "width", "400");
    			attr_dev(svg0, "height", "400");
    			attr_dev(svg0, "viewBox", "0, 0, 400,400");
    			attr_dev(svg0, "class", "svelte-2q6nin");
    			add_location(svg0, file, 13, 11, 398);
    			attr_dev(a, "class", "logo-link svelte-2q6nin");
    			attr_dev(a, "href", "/");
    			add_location(a, file, 12, 8, 357);
    			add_location(li0, file, 11, 6, 344);
    			add_location(ul0, file, 10, 4, 333);
    			attr_dev(li1, "class", "large svelte-2q6nin");
    			add_location(li1, file, 32, 6, 2384);
    			attr_dev(li2, "class", "large svelte-2q6nin");
    			add_location(li2, file, 33, 6, 2443);
    			attr_dev(li3, "class", "large svelte-2q6nin");
    			add_location(li3, file, 34, 6, 2502);
    			attr_dev(path1, "d", "M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z");
    			add_location(path1, file, 39, 183, 2919);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 448 512");
    			attr_dev(svg1, "class", "svelte-2q6nin");
    			add_location(svg1, file, 38, 12, 2674);
    			attr_dev(summary, "aria-haspopup", "listbox");
    			attr_dev(summary, "class", "svelte-2q6nin");
    			add_location(summary, file, 37, 10, 2628);
    			add_location(li4, file, 46, 12, 3399);
    			add_location(li5, file, 47, 12, 3450);
    			add_location(li6, file, 48, 12, 3501);
    			attr_dev(ul1, "role", "listbox");
    			attr_dev(ul1, "class", "svelte-2q6nin");
    			add_location(ul1, file, 45, 10, 3367);
    			attr_dev(details, "role", "list");
    			add_location(details, file, 36, 8, 2596);
    			attr_dev(li7, "class", "hamburger svelte-2q6nin");
    			add_location(li7, file, 35, 6, 2565);
    			add_location(ul2, file, 31, 4, 2373);
    			attr_dev(nav, "class", "container-fluid svelte-2q6nin");
    			add_location(nav, file, 9, 2, 299);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a);
    			append_dev(a, svg0);
    			append_dev(svg0, g);
    			append_dev(g, path0);
    			append_dev(a, t0);
    			append_dev(nav, t1);
    			append_dev(nav, ul2);
    			append_dev(ul2, li1);
    			mount_component(link0, li1, null);
    			append_dev(ul2, t2);
    			append_dev(ul2, li2);
    			mount_component(link1, li2, null);
    			append_dev(ul2, t3);
    			append_dev(ul2, li3);
    			mount_component(link2, li3, null);
    			append_dev(ul2, t4);
    			append_dev(ul2, li7);
    			append_dev(li7, details);
    			append_dev(details, summary);
    			append_dev(summary, svg1);
    			append_dev(svg1, path1);
    			append_dev(details, t5);
    			append_dev(details, ul1);
    			append_dev(ul1, li4);
    			mount_component(link3, li4, null);
    			append_dev(ul1, t6);
    			append_dev(ul1, li5);
    			mount_component(link4, li5, null);
    			append_dev(ul1, t7);
    			append_dev(ul1, li6);
    			mount_component(link5, li6, null);
    			insert_dev(target, t8, anchor);
    			mount_component(route0, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(route3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const link5_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link5_changes.$$scope = { dirty, ctx };
    			}

    			link5.$set(link5_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(link5);
    			if (detaching) detach_dev(t8);
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(route3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(9:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { url = "" } = $$props;
    	const writable_props = ['url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Link,
    		Route,
    		Home,
    		About,
    		Login,
    		Course,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
