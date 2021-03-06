/**
 * Limiter
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * This decorator limit the number of times its child can be called. After a
 * certain number of times, the Limiter decorator returns `FAILURE` without 
 * executing the child.
 *
 * @class Limiter
 * @extends Decorator
**/
var Limiter = b3.Class(b3.Decorator);

var p = Limiter.prototype;

    /**
     * Node name. Default to `Limiter`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'Limiter';

    /**
     * Node parameters.
     *
     * @property parameters
     * @type {String}
     * @readonly
    **/
    p.parameters = {'maxLoop': null};
    
    p.__Decorator_initialize = p.initialize;
    /**
     * Initialization method. 
     *
     * Settings parameters:
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions.
     * - **child** (*BaseNode*) The child node.
     *
     * @method initialize
     * @param {Object} settings Object with parameters.
     * @constructor
    **/
    p.initialize = function(settings) {
        settings = settings || {};

        this.__Decorator_initialize(settings);

        if (!settings.maxLoop) {
            throw "maxLoop parameter in Limiter decorator is an obligatory " +
                  "parameter";
        }

        this.maxLoop = settings.maxLoop;
    }

    /**
     * Open method.
     *
     * @method open
     * @param {Tick} tick A tick instance.
    **/
    p.open = function(tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        if (!this.child) {
            return b3.ERROR;
        }

        var i = tick.blackboard.get('i', tick.tree.id, this.id);

        if (i < this.maxLoop) {
            var status = this.child._execute(tick);

            if (status == b3.SUCCESS || status == b3.FAILURE)
                tick.blackboard.set('i', i+1, tick.tree.id, this.id);
            
            return status;
        }

        return b3.FAILURE;        
    }

b3.Limiter = Limiter;

})();