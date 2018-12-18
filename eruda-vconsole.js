(function(root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define([], factory);
    } else if (typeof module === 'object' && module.exports)
    {
        module.exports = factory();
    } else { root.erudaVconsole = factory(); }
}(this, function ()
{
    return function (eruda) 
    {
        var Tool = eruda.Tool,
            util = eruda.util;

        var Vconsole = Tool.extend({
            name: 'vconsole',
            init: function ($el) 
            {
                this.callSuper(Tool, 'init', arguments);
                this._style = util.evalCss([
                    '.eruda-dev-tools .eruda-tools .eruda-vconsole {padding: 10px;}',
                    '.eruda-vconsole-btn {margin: 40px auto 0; padding: 0 10px; width: 240px; height: 44px; text-align: center; line-height: 44px; border-radius: 2px; background: #3292ff; color: #fff;}'
                ].join('.eruda-dev-tools .eruda-tools .eruda-vconsole '));
                $el.html('<div class="eruda-vconsole-btn">切换至VConsole</div>');
                this._bindEvent()
            },
            show: function () 
            {
                this.callSuper(Tool, 'show', arguments);
            },
            hide: function () 
            {
                this.callSuper(Tool, 'hide', arguments);
            },
            destroy: function () 
            {
                this.callSuper(Tool, 'destroy', arguments);
                util.evalCss.remove(this._style);
            },
            _bindEvent () {
                var self = this;
                this._$el.on('click', '.eruda-vconsole-btn', function () {
                    self._loadVConsole()
                })
            },
            _loadVConsole () {
                var self = this;
                if (window.VConsole) {
                    self._run()
                    return
                }
                let script = window.document.createElement('script');
                script.type = 'text/javascript';
                if (script.readyState) {
                    script.onreadystatechange = function () {
                        if (script.readyState === 'loaded' || script.readyState === 'complete') {
                            script.onreadystatechange = null
                            self._run()
                        }
                    }
                } else {
                    script.onload = function () {
                        self._run()
                    }
                }
                script.src = '//cdn.jsdelivr.net/npm/vconsole'
                window.document.body.appendChild(script)
            },
            _run () {
                var _origSetRequestHeader = window.eruda._devTools.get('network')._origSetRequestHeader
                if (_origSetRequestHeader) window.XMLHttpRequest.prototype.setRequestHeader = _origSetRequestHeader
                eruda.destroy()
                window.vConsole = new window.VConsole()
            }
        });

        return new Vconsole();
    };
}));