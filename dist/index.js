'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class2, _temp;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('animated/lib/targets/react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

        _initialiseProps.call(_this);

        _this.state = { ready: false };
        _this.layers = [];
        _this.height = 0;
        _this.scrollTop = 0;
        _this.busy = false;
        return _this;
    }

    _createClass(_class, [{
        key: 'scrollTo',
        value: function scrollTo(offset) {
            this.scrollStop();
            var target = this.refs.container;
            this.animatedScroll = new _reactDom2.default.Value(target.scrollTop);
            this.animatedScroll.addListener(function (_ref) {
                var value = _ref.value;
                return target.scrollTop = value;
            });
            this.props.effect(this.animatedScroll, offset * this.height).start();
        }
    }, {
        key: 'getChildContext',
        value: function getChildContext() {
            return { parallax: this };
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            window.addEventListener('resize', this.update, false);
            this.update();
            this.setState({ ready: true });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.update, false);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this.update();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                {
                    ref: 'container',
                    onScroll: this.onScroll,
                    onWheel: this.scrollStop,
                    onTouchStart: this.scrollStop,
                    style: _extends({
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        overflow: 'scroll',
                        overflowX: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        transform: 'translate3d(0, 0, 0)'
                    }, this.props.style),
                    className: this.props.className },
                this.state.ready && _react2.default.createElement(
                    'div',
                    {
                        ref: 'content',
                        style: _extends({
                            position: 'absolute',
                            width: '100%',
                            transform: 'translate3d(0, 0, 0)',
                            overflow: 'hidden',
                            height: this.height * this.props.pages
                        }, this.props.innerStyle) },
                    this.props.children
                )
            );
        }
    }]);

    return _class;
}(_react2.default.Component);

_class.propTypes = {
    pages: _react2.default.PropTypes.number.isRequired,
    effect: _react2.default.PropTypes.func
};
_class.defaultProps = {
    effect: function effect(animation, toValue) {
        return _reactDom2.default.spring(animation, { toValue: toValue });
    }
};
_class.childContextTypes = { parallax: _react2.default.PropTypes.object };
_class.Layer = (_temp = _class2 = function (_React$Component2) {
    _inherits(_class2, _React$Component2);

    function _class2(props, context) {
        _classCallCheck(this, _class2);

        var _this2 = _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).call(this, props, context));

        var parallax = context.parallax;
        var targetScroll = Math.floor(props.offset) * parallax.height;
        var offset = parallax.height * props.offset + targetScroll * props.speed;
        var toValue = parseFloat(-(parallax.scrollTop * props.speed) + offset);
        _this2.animatedTranslate = new _reactDom2.default.Value(toValue);
        var height = parallax.height * props.factor;
        _this2.animatedHeight = new _reactDom2.default.Value(height);
        return _this2;
    }

    _createClass(_class2, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var parent = this.context.parallax;
            parent.layers = parent.layers.concat(this);
            parent.update();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var _this3 = this;

            var parent = this.context.parallax;
            parent.layers = parent.layers.filter(function (layer) {
                return layer !== _this3;
            });
            parent.update();
        }
    }, {
        key: 'setPosition',
        value: function setPosition(height, scrollTop) {
            var targetScroll = Math.floor(this.props.offset) * height;
            var offset = height * this.props.offset + targetScroll * this.props.speed;
            var toValue = parseFloat(-(scrollTop * this.props.speed) + offset);
            this.context.parallax.props.effect(this.animatedTranslate, toValue).start();
        }
    }, {
        key: 'setHeight',
        value: function setHeight(height) {
            var toValue = parseFloat(height * this.props.factor);
            this.context.parallax.props.effect(this.animatedHeight, toValue).start();
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                style = _props.style,
                children = _props.children,
                offset = _props.offset,
                speed = _props.speed,
                factor = _props.factor,
                props = _objectWithoutProperties(_props, ['style', 'children', 'offset', 'speed', 'factor']);

            return _react2.default.createElement(
                _reactDom2.default.div,
                _extends({}, props, {
                    ref: 'layer',
                    style: _extends({
                        position: 'absolute',
                        backgroundSize: 'auto',
                        backgroundRepeat: 'no-repeat',
                        willChange: 'transform',
                        width: '100%',
                        height: this.animatedHeight,
                        transform: [{
                            translate3d: this.animatedTranslate.interpolate({
                                inputRange: [0, 1], outputRange: ['0,0px,0', '0,1px,0']
                            })
                        }]
                    }, style) }),
                children
            );
        }
    }]);

    return _class2;
}(_react2.default.Component), _class2.contextTypes = { parallax: _react2.default.PropTypes.object }, _class2.propTypes = {
    factor: _react2.default.PropTypes.number,
    offset: _react2.default.PropTypes.number,
    speed: _react2.default.PropTypes.number
}, _class2.defaultProps = {
    factor: 1,
    offset: 0,
    speed: 0
}, _temp);

var _initialiseProps = function _initialiseProps() {
    var _this4 = this;

    this.moveItems = function () {
        _this4.layers.forEach(function (layer) {
            return layer.setPosition(_this4.height, _this4.scrollTop);
        });
        _this4.busy = false;
    };

    this.scrollerRaf = function () {
        return requestAnimationFrame(_this4.moveItems);
    };

    this.onScroll = function (event) {
        if (!_this4.busy) {
            _this4.busy = true;
            _this4.scrollerRaf();
            _this4.scrollTop = event.target.scrollTop;
        }
    };

    this.update = function () {
        _this4.scrollTop = _this4.refs.container.scrollTop;
        _this4.height = _this4.refs.container.clientHeight;
        if (_this4.refs.content) _this4.refs.content.style.height = _this4.height * _this4.props.pages + 'px';
        _this4.layers.forEach(function (layer) {
            return layer.setHeight(_this4.height);
        });
        _this4.moveItems();
    };

    this.scrollStop = function (event) {
        return _this4.animatedScroll && _this4.animatedScroll.stopAnimation();
    };
};

exports.default = _class;
