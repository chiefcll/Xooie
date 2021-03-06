/*
*   Copyright 2012 Comcast
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

define('xooie/stylesheet', ['jquery'], function($) {
    var Stylesheet = function(name){
        var i, title;

        //check to see if a stylesheet already exists with this name
        this.element = $('style[id=' + name + ']');

        if (this.element.length <= 0) {
            //if it does, use it, else create a new one
            this.element = $(['<style id="' + name + '">',
                                '/* This is a dynamically generated stylesheet: ' + name + ' */',
                            '</style>'].join(''));

            this.element.appendTo($('head'));
        }

        if (document.styleSheets) {
            for (i = 0; i < document.styleSheets.length; i += 1){
                if (document.styleSheets[i].ownerNode.getAttribute('id') === name) {
                    this._index = i;
                }
            }
        }
    };

    Stylesheet.prototype.get = function(){
        return document.styleSheets[this._index];
    };

    Stylesheet.prototype.getRule = function(ruleName){
        ruleName = ruleName.toLowerCase();

        var i, rules;

        //Check if this uses the IE format (styleSheet.rules) or the Mozilla/Webkit format
        rules = this.get().cssRules || this.get().rules;

        for (i = 0; i < rules.length; i += 1){
            if (rules[i].selectorText.toLowerCase() === ruleName) {
                return rules[i];
            }
        }

        return false;
    };

    Stylesheet.prototype.addRule = function(ruleName, properties){
        var rule = this.getRule(ruleName), index, prop, propString = '';

        if (!rule){
            for (prop in properties) {
                propString += prop + ': ' + properties[prop] + ';';
            }

            if (this.get().insertRule) {
                //This is the W3C-preferred method
                index = this.get().cssRules.length;
                this.get().insertRule(ruleName + ' {' + propString + '}', index);
                rule = this.get().cssRules[index];
            } else {
                //support for IE < 9
                index = this.get().rules.length;
                this.get().addRule(ruleName, propString, index);
                rule = this.get().rules[index];
            }
        }

        return rule;
    };

    Stylesheet.prototype.deleteRule = function(ruleName){
        ruleName = ruleName.toLowerCase();

        var i, rules;

        //Check if this uses the IE format (styleSheet.rules) or the Mozilla/Webkit format
        rules = this.get().cssRules || this.get().rules;

        for (i = 0; i < rules.length; i += 1){
            if (rules[i].selectorText.toLowerCase() === ruleName) {
                if (this.get().deleteRule) {
                    //this is the W3C-preferred method
                    this.get().deleteRule(i);
                } else {
                    //support for IE < 9
                    this.get().removeRule(i);
                }

                return true;
            }
        }

        return false;
    };

    return Stylesheet;

});