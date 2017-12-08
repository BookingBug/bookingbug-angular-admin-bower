'use strict';

angular.module('BBAdmin', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Directives', 'BBAdmin.Controllers', 'BBAdmin.Models', 'BBAdmin.Directives', 'trNgGrid']);

angular.module('BBAdmin.Directives', []);

angular.module('BBAdmin.Filters', []);

angular.module('BBAdmin.Models', []);

angular.module('BBAdmin.Services', ['ngResource', 'ngSanitize']);

angular.module('BBAdmin.Controllers', ['ngSanitize']);
'use strict';

angular.module('BBAdmin').config(function ($logProvider) {
    'ngInject';

    $logProvider.debugEnabled(true);
});

angular.module('BB').config(function (FormTransformProvider) {
    'ngInject';

    FormTransformProvider.setTransform('edit', 'Admin_Booking', function (form, schema, model) {
        var disable_list = void 0;
        if (model && (model.status === 3 || model.status === 4)) {
            // blocked - don't disable the datetime
            disable_list = ['service', 'person_id', 'resource_id'];
        } else {
            disable_list = ['datetime', 'service', 'person_id', 'resource_id'];
        }

        if (form[0].tabs) {
            _.each(form[0].tabs[0].items, function (item) {
                if (_.indexOf(disable_list, item.key) > -1) {
                    return item.readonly = true;
                }
            });
        } else {
            _.each(form, function (item) {
                if (_.indexOf(disable_list, item.key) > -1) {
                    return item.readonly = true;
                }
            });
        }
        return form;
    });
});
'use strict';

angular.module('BBAdmin.Services').run(function ($q, $injector, BBModel) {
    'ngInject';

    var models = ['Booking', 'Slot', 'User', 'Administrator', 'Schedule', 'Address', 'Resource', 'Person', 'Service', 'Login', 'EventChain', 'EventGroup', 'Event', 'Clinic', 'Company', 'Client'];

    var afuncs = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Array.from(models)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var model = _step.value;

            afuncs[model] = $injector.get('Admin' + model + 'Model');
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    BBModel['Admin'] = afuncs;
});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.Collection.Booking = function (_window$Collection$Ba) {
    _inherits(Booking, _window$Collection$Ba);

    function Booking() {
        _classCallCheck(this, Booking);

        return _possibleConstructorReturn(this, _window$Collection$Ba.apply(this, arguments));
    }

    Booking.prototype.checkItem = function checkItem(item) {
        var _window$Collection$Ba2;

        return (_window$Collection$Ba2 = _window$Collection$Ba.prototype.checkItem).call.apply(_window$Collection$Ba2, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Booking.prototype.matchesParams = function matchesParams(item) {
        if (this.params.start_date != null && item.start) {
            if (this.start_date == null) {
                this.start_date = moment(this.params.start_date);
            }
            if (this.start_date.isAfter(item.start)) {
                return false;
            }
        }
        if (this.params.end_date != null && item.start) {
            if (this.end_date == null) {
                this.end_date = moment(this.params.end_date);
            }
            if (this.end_date.isBefore(item.start.clone().startOf('day'))) {
                return false;
            }
        }
        if (!this.params.include_cancelled && item.is_cancelled) {
            return false;
        }
        return true;
    };

    return Booking;
}(window.Collection.Base);

angular.module('BB.Services').provider("BookingCollections", function () {
    return {
        $get: function $get() {
            return new window.BaseCollections();
        }
    };
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.Collection.Client = function (_window$Collection$Ba) {
    _inherits(Client, _window$Collection$Ba);

    function Client() {
        _classCallCheck(this, Client);

        return _possibleConstructorReturn(this, _window$Collection$Ba.apply(this, arguments));
    }

    Client.prototype.checkItem = function checkItem(item) {
        var _window$Collection$Ba2;

        return (_window$Collection$Ba2 = _window$Collection$Ba.prototype.checkItem).call.apply(_window$Collection$Ba2, [this].concat(Array.prototype.slice.call(arguments)));
    };

    return Client;
}(window.Collection.Base);

angular.module('BB.Services').provider("ClientCollections", function () {
    return {
        $get: function $get() {
            return new window.BaseCollections();
        }
    };
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.Collection.Slot = function (_window$Collection$Ba) {
    _inherits(Slot, _window$Collection$Ba);

    function Slot() {
        _classCallCheck(this, Slot);

        return _possibleConstructorReturn(this, _window$Collection$Ba.apply(this, arguments));
    }

    Slot.prototype.checkItem = function checkItem(item) {
        var _window$Collection$Ba2;

        return (_window$Collection$Ba2 = _window$Collection$Ba.prototype.checkItem).call.apply(_window$Collection$Ba2, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Slot.prototype.matchesParams = function matchesParams(item) {
        if (this.params.start_date) {
            if (!this.start_date) {
                this.start_date = moment(this.params.start_date);
            }
            if (this.start_date.isAfter(item.date)) {
                return false;
            }
        }
        if (this.params.end_date) {
            if (!this.end_date) {
                this.end_date = moment(this.params.end_date);
            }
            if (this.end_date.isBefore(item.date)) {
                return false;
            }
        }
        return true;
    };

    return Slot;
}(window.Collection.Base);

angular.module('BB.Services').provider("SlotCollections", function () {
    return {
        $get: function $get() {
            return new window.BaseCollections();
        }
    };
});
'use strict';

angular.module('BBAdmin.Controllers').controller('CalendarCtrl', function ($scope, BBModel, $rootScope) {

    $scope.eventsF = function (start, end, tz, callback) {
        var prms = { company_id: 21 };
        prms.start_date = start.format("YYYY-MM-DD");
        prms.end_date = end.format("YYYY-MM-DD");
        var bookings = BBModel.Admin.Booking.$query(prms);
        return bookings.then(function (s) {
            callback(s.items);
            return s.addCallback(function (booking) {
                return $scope.myCalendar.fullCalendar('renderEvent', booking, true);
            });
        });
    };

    $scope.dayClick = function (date, allDay, jsEvent, view) {
        return $scope.$apply(function () {
            return $scope.alertMessage = 'Day Clicked ' + date;
        });
    };

    // alert on Drop
    $scope.alertOnDrop = function (event, revertFunc, jsEvent, ui, view) {
        return $scope.$apply(function () {
            return $scope.popupTimeAction({ action: "move", booking: event, newdate: event.start, onCancel: revertFunc });
        });
    };

    // alert on Resize
    $scope.alertOnResize = function (event, revertFunc, jsEvent, ui, view) {
        return $scope.$apply(function () {
            return $scope.alertMessage = 'Event Resized ';
        });
    };

    // add and removes an event source of choice
    $scope.addRemoveEventSource = function (sources, source) {
        var canAdd = 0;
        angular.forEach(sources, function (value, key) {
            if (sources[key] === source) {
                sources.splice(key, 1);
                return canAdd = 1;
            }
        });
        if (canAdd === 0) {
            return sources.push(source);
        }
    };

    // add custom event
    $scope.addEvent = function () {
        var y = '';
        var m = '';
        return $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            className: ['openSesame']
        });
    };

    // remove event
    $scope.remove = function (index) {
        return $scope.events.splice(index, 1);
    };

    // Change View
    $scope.changeView = function (view) {
        return $scope.myCalendar.fullCalendar('changeView', view);
    };

    $scope.eventClick = function (event, jsEvent, view) {
        return $scope.$apply(function () {
            return $scope.selectBooking(event);
        });
    };

    $scope.selectTime = function (start, end, allDay) {
        return $scope.$apply(function () {
            $scope.popupTimeAction({ start_time: moment(start), end_time: moment(end), allDay: allDay });
            return $scope.myCalendar.fullCalendar('unselect');
        });
    };

    // config object
    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: true,
            header: {
                left: 'month agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            ignoreTimezone: false,
            dayClick: $scope.dayClick,
            eventClick: $scope.eventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            selectable: true,
            selectHelper: true,
            select: $scope.selectTime

        }
    };
    // event sources array*
    return $scope.eventSources = [$scope.eventsF];
});
'use strict';

angular.module('BBAdmin.Controllers').controller('CategoryList', function ($scope, $location, $rootScope, BBModel) {

        $rootScope.connection_started.then(function () {
                $scope.categories = BBModel.Category.$query($scope.bb.company);

                return $scope.categories.then(function (items) {});
        });

        $scope.$watch('selectedCategory', function (newValue, oldValue) {

                $rootScope.category = newValue;

                return $('.inline_time').each(function (idx, e) {
                        return angular.element(e).scope().clear();
                });
        });

        return $scope.$on("Refresh_Cat", function (event, message) {
                return $scope.$apply();
        });
});
'use strict';

(function () {

    angular.module('BBAdmin.Directives').directive('bbAdminClients', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            controller: AdminClientsCtrl
        };
    });

    function AdminClientsCtrl($scope, $rootScope, $q, $log, LoadingService, BBModel) {
        'ngInject';

        $scope.clientDef = $q.defer();
        $scope.clientPromise = $scope.clientDef.promise;
        $scope.per_page = 15;
        $scope.total_entries = 0;
        $scope.clients = [];

        var loader = LoadingService.$loader($scope);

        $scope.getClients = function (currentPage, filterBy, filterByFields, orderBy, orderByReverse) {
            var clientDef = $q.defer();

            $rootScope.connection_started.then(function () {
                loader.notLoaded();
                var params = {
                    company: $scope.bb.company,
                    per_page: $scope.per_page,
                    page: currentPage + 1,
                    filter_by: filterBy,
                    filter_by_fields: filterByFields,
                    order_by: orderBy,
                    order_by_reverse: orderByReverse
                };
                return BBModel.Admin.Client.$query(params).then(function (clients) {
                    $scope.clients = clients.items;
                    loader.setLoaded();
                    $scope.setPageLoaded();
                    $scope.total_entries = clients.total_entries;
                    return clientDef.resolve(clients.items);
                }, function (err) {
                    clientDef.reject(err);
                    return loader.setLoadedAndShowError(err, 'Sorry, something went wrong');
                });
            });
            return true;
        };

        $scope.edit = function (item) {
            return $log.info("not implemented");
        };
    }
})();
'use strict';

angular.module('BBAdmin.Controllers').controller('CompanyList', function ($scope, $rootScope, $location) {

    var d = void 0,
        date = void 0,
        result = void 0;
    $scope.selectedCategory = null;

    $rootScope.connection_started.then(function () {
        date = moment();
        $scope.current_date = date;
        $scope.companies = $scope.bb.company.companies;
        if (!$scope.companies || $scope.companies.length === 0) {
            $scope.companies = [$scope.bb.company];
        }
        $scope.dates = [];
        var end = moment(date).add(21, 'days');
        $scope.end_date = end;
        d = moment(date);
        return function () {
            result = [];
            while (d.isBefore(end)) {
                $scope.dates.push(d.clone());
                result.push(d.add(1, 'days'));
            }
            return result;
        }();
    });

    $scope.selectCompany = function (item) {
        return $location = '/view/dashboard/pick_company/' + item.id;
    };

    $scope.advance_date = function (num) {
        date = $scope.current_date.add(num, 'days');
        $scope.end_date = moment(date).add(21, 'days');
        $scope.current_date = moment(date);
        $scope.dates = [];
        d = date.clone();
        return function () {
            result = [];
            while (d.isBefore($scope.end_date)) {
                $scope.dates.push(d.clone());
                result.push(d.add(1, 'days'));
            }
            return result;
        }();
    };

    return $scope.$on("Refresh_Comp", function (event, message) {
        return $scope.$apply();
    });
});
'use strict';

angular.module('BBAdmin.Controllers').controller('DashboardContainer', function ($scope, $rootScope, $location, $uibModal, $document) {

    $scope.selectedBooking = null;
    $scope.poppedBooking = null;

    $scope.selectBooking = function (booking) {
        return $scope.selectedBooking = booking;
    };

    $scope.popupBooking = function (booking) {
        $scope.poppedBooking = booking;

        var modalInstance = $uibModal.open({
            templateUrl: 'full_booking_details',
            controller: ModalInstanceCtrl,
            scope: $scope,
            backdrop: true,
            resolve: {
                items: function items() {
                    return { booking: booking };
                }
            }
        });

        return modalInstance.result.then(function (selectedItem) {
            return $scope.selected = selectedItem;
        }, function () {
            return console.log('Modal dismissed at: ' + new Date());
        });
    };

    var ModalInstanceCtrl = function ModalInstanceCtrl($scope, $uibModalInstance, items) {
        angular.extend($scope, items);
        $scope.ok = function () {
            if (items.booking && items.booking.self) {
                items.booking.$update();
            }
            return $uibModalInstance.close();
        };
        return $scope.cancel = function () {
            return $uibModalInstance.dismiss('cancel');
        };
    };

    // a popup performing an action on a time, possible blocking, or mkaing a new booking
    return $scope.popupTimeAction = function (prms) {

        return $uibModal.open({
            templateUrl: $scope.partial_url + 'time_popup',
            controller: ModalInstanceCtrl,
            scope: $scope,
            backdrop: false,
            resolve: {
                items: function items() {
                    return prms;
                }
            }
        });
    };
});
'use strict';

angular.module('BBAdmin.Controllers').controller('DashDayList', function ($scope, $rootScope, $q, BBModel) {

    var date = void 0;
    $scope.init = function (company_id) {
        $scope.inline_items = "";
        if (company_id) {
            $scope.bb.company_id = company_id;
        }
        if (!$scope.current_date) {
            $scope.current_date = moment().startOf('month');
        }
        date = $scope.current_date;
        var prms = { date: date.format('DD-MM-YYYY'), company_id: $scope.bb.company_id };
        if ($scope.service_id) {
            prms.service_id = $scope.service_id;
        }
        if ($scope.end_date) {
            prms.edate = $scope.end_date.format('DD-MM-YYYY');
        }

        // create a promise for the weeks and go get the days!
        var dayListDef = $q.defer();
        var weekListDef = $q.defer();
        $scope.dayList = dayListDef.promise;
        $scope.weeks = weekListDef.promise;
        prms.url = $scope.bb.api_url;

        return BBModel.Admin.Day.$query(prms).then(function (days) {
            $scope.sdays = days;
            dayListDef.resolve();
            if ($scope.category) {
                return $scope.update_days();
            }
        });
    };

    $scope.format_date = function (fmt) {
        return $scope.current_date.format(fmt);
    };

    $scope.selectDay = function (day, dayBlock, e) {
        if (day.spaces === 0) {
            return false;
        }
        var seldate = moment($scope.current_date);
        seldate.date(day.day);
        $scope.selected_date = seldate;

        var elm = angular.element(e.toElement);
        elm.parent().children().removeClass("selected");
        elm.addClass("selected");
        var xelm = $('#tl_' + $scope.bb.company_id);
        $scope.service_id = dayBlock.service_id;
        $scope.service = { id: dayBlock.service_id, name: dayBlock.name };
        $scope.selected_day = day;
        if (xelm.length === 0) {
            return $scope.inline_items = "/view/dash/time_small";
        } else {
            return xelm.scope().init(day);
        }
    };

    $scope.$watch('current_date', function (newValue, oldValue) {
        if (newValue && $scope.bb.company_id) {
            return $scope.init();
        }
    });

    $scope.update_days = function () {
        $scope.dayList = [];
        $scope.service_id = null;

        return function () {
            var result = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Array.from($scope.sdays)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var day = _step.value;

                    var item = void 0;
                    if (day.category_id === $scope.category.id) {
                        $scope.dayList.push(day);
                        item = $scope.service_id = day.id;
                    }
                    result.push(item);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return result;
        }();
    };

    return $rootScope.$watch('category', function (newValue, oldValue) {
        if (newValue && $scope.sdays) {
            return $scope.update_days();
        }
    });
});
'use strict';

angular.module('BBAdmin.Controllers').controller('EditBookingDetails', function ($scope, $location, $rootScope) {});
'use strict';

angular.module('BBAdmin.Directives').directive('bbAdminLogin', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            onSuccess: '=',
            onCancel: '=',
            onError: '=',
            bb: '='
        },
        controller: 'AdminLogin',
        template: '<div ng-include="login_template"></div>'
    };
});

angular.module('BBAdmin.Controllers').controller('AdminLogin', function ($scope, $rootScope, $q, $sessionStorage, BBModel) {

    $scope.login_data = {
        host: $sessionStorage.getItem('host'),
        email: null,
        password: null,
        selected_admin: null
    };

    $scope.login_template = 'login/admin_login.html';

    $scope.login = function () {
        $scope.alert = "";
        var params = {
            email: $scope.login_data.email,
            password: $scope.login_data.password
        };
        return BBModel.Admin.Login.$login(params).then(function (user) {
            if (user.company_id != null) {
                $scope.user = user;
                if ($scope.onSuccess) {
                    return $scope.onSuccess();
                }
            } else {
                return user.$getAdministrators().then(function (administrators) {
                    $scope.administrators = administrators;
                    return $scope.pickCompany();
                });
            }
        }, function (err) {
            return $scope.alert = "Sorry, either your email or password was incorrect";
        });
    };

    $scope.pickCompany = function () {
        return $scope.login_template = 'login/admin_pick_company.html';
    };

    return $scope.selectedCompany = function () {
        $scope.alert = "";
        var params = {
            email: $scope.login_data.email,
            password: $scope.login_data.password
        };
        return $scope.login_data.selected_admin.$post('login', {}, params).then(function (login) {
            return $scope.login_data.selected_admin.$getCompany().then(function (company) {
                $scope.bb.company = company;
                BBModel.Admin.Login.$setLogin($scope.login_data.selected_admin);
                return $scope.onSuccess(company);
            });
        });
    };
});
'use strict';

angular.module('BBAdmin.Controllers').controller('SelectedBookingDetails', function ($scope, $location, $rootScope, BBModel) {
    return $scope.$watch('selectedBooking', function (newValue, oldValue) {
        if (newValue) {
            $scope.booking = newValue;
            return $scope.showItemView = "/view/dash/booking_details";
        }
    });
});
'use strict';

angular.module('BBAdmin.Controllers').controller('DashTimeList', function ($scope, $rootScope, $location, $q, $element, AdminTimeService) {

    var k = void 0,
        slots = void 0;

    // Add a method that will be available in all retrieved CreditCard objects :
    $scope.init = function (day) {
        $scope.selected_day = day;
        var elem = angular.element($element);
        elem.attr('id', 'tl_' + $scope.bb.company_id);
        angular.element($element).show();

        var prms = { company_id: $scope.bb.company_id, day: day };
        if ($scope.service_id) {
            prms.service_id = $scope.service_id;
        }

        var timeListDef = $q.defer();
        $scope.slots = timeListDef.promise;
        prms.url = $scope.bb.api_url;

        $scope.aslots = AdminTimeService.query(prms);
        return $scope.aslots.then(function (res) {
            $scope.loaded = true;
            slots = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Array.from(res)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var x = _step.value;

                    if (!slots[x.time]) {
                        slots[x.time] = x;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var xres = [];
            for (k in slots) {
                var slot = slots[k];
                xres.push(slot);
            }
            return timeListDef.resolve(xres);
        });
    };

    if ($scope.selected_day) {
        $scope.init($scope.selected_day);
    }

    $scope.format_date = function (fmt) {
        return $scope.selected_date.format(fmt);
    };

    $scope.selectSlot = function (slot, route) {
        $scope.pickTime(slot.time);
        $scope.pickDate($scope.selected_date);
        return $location.path(route);
    };

    $scope.highlighSlot = function (slot) {
        $scope.pickTime(slot.time);
        $scope.pickDate($scope.selected_date);
        return $scope.setCheckout(true);
    };

    $scope.clear = function () {
        $scope.loaded = false;
        $scope.slots = null;
        return angular.element($element).hide();
    };

    return $scope.popupCheckout = function (slot) {
        var item = {
            time: slot.time,
            date: $scope.selected_day.date,
            company_id: $scope.bb.company_id,
            duration: 30,
            service_id: $scope.service_id,
            event_id: slot.id
        };
        var url = "/booking/new_checkout?";
        for (k in item) {
            var v = item[k];
            url += k + "=" + v + "&";
        }
        var wWidth = $(window).width();
        var dWidth = wWidth * 0.8;
        var wHeight = $(window).height();
        var dHeight = wHeight * 0.8;
        var dlg = $("#dialog-modal");
        dlg.html('<iframe frameborder=0 id=\'mod_dlg\' onload=\'nowait();setTimeout(set_iframe_focus, 100);\' width=100% height=99% src=\'' + url + '\'></iframe>');
        dlg.attr("title", "Checkout");
        return dlg.dialog({
            my: "top", at: "top",
            height: dHeight,
            width: dWidth,
            modal: true,
            overlay: { opacity: 0.1, background: "black" }
        });
    };
});
'use strict';

angular.module('BBAdmin.Controllers').controller('TimeOptions', function ($scope, $location, $rootScope, BBModel) {

    BBModel.Admin.Resource.$query({ company: $scope.bb.company }).then(function (resources) {
        return $scope.resources = resources;
    });

    BBModel.Admin.Person.$query({ company: $scope.bb.company }).then(function (people) {
        return $scope.people = people;
    });

    return $scope.block = function () {
        if ($scope.person) {
            var params = {
                start_time: $scope.start_time,
                end_time: $scope.end_time
            };
            BBModel.Admin.Person.$block($scope.bb.company, $scope.person, params);
        }
        return $scope.ok();
    };
});
'use strict';

angular.module('BBAdmin.Directives').directive('adminLogin', function ($uibModal, $log, $rootScope, $q, $document, BBModel) {

    var loginAdminController = function loginAdminController($scope, $uibModalInstance, company_id) {
        $scope.title = 'Login';
        $scope.schema = {
            type: 'object',
            properties: {
                email: { type: 'string', title: 'Email' },
                password: { type: 'string', title: 'Password' }
            }
        };
        $scope.form = [{
            key: 'email',
            type: 'email',
            feedback: false,
            autofocus: true
        }, {
            key: 'password',
            type: 'password',
            feedback: false
        }];
        $scope.login_form = {};

        $scope.submit = function (form) {
            var options = { company_id: company_id };
            return BBModel.Admin.Login.$login(form, options).then(function (admin) {
                admin.email = form.email;
                admin.password = form.password;
                return $uibModalInstance.close(admin);
            }, function (err) {
                return $uibModalInstance.dismiss(err);
            });
        };

        return $scope.cancel = function () {
            return $uibModalInstance.dismiss('cancel');
        };
    };

    var pickCompanyController = function pickCompanyController($scope, $uibModalInstance, companies) {
        var c = void 0;
        $scope.title = 'Pick Company';
        $scope.schema = {
            type: 'object',
            properties: {
                company_id: { type: 'integer', title: 'Company' }
            }
        };
        $scope.schema.properties.company_id.enum = function () {
            var result = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Array.from(companies)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    c = _step.value;

                    result.push(c.id);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return result;
        }();
        $scope.form = [{
            key: 'company_id',
            type: 'select',
            titleMap: function () {
                var result1 = [];
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Array.from(companies)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        c = _step2.value;

                        result1.push({ value: c.id, name: c.name });
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return result1;
            }(),
            autofocus: true
        }];
        $scope.pick_company_form = {};

        $scope.submit = function (form) {
            return $uibModalInstance.close(form.company_id);
        };

        return $scope.cancel = function () {
            return $uibModalInstance.dismiss('cancel');
        };
    };

    var link = function link(scope, element, attrs) {
        if (!$rootScope.bb) {
            $rootScope.bb = {};
        }
        if (!$rootScope.bb.api_url) {
            $rootScope.bb.api_url = scope.apiUrl;
        }
        if (!$rootScope.bb.api_url) {
            $rootScope.bb.api_url = "http://www.bookingbug.com";
        }

        var loginModal = function loginModal() {
            var modalInstance = $uibModal.open({
                templateUrl: 'login_modal_form.html',
                controller: loginAdminController,
                resolve: {
                    company_id: function company_id() {
                        return scope.companyId;
                    }
                }
            });
            return modalInstance.result.then(function (result) {
                scope.adminEmail = result.email;
                scope.adminPassword = result.password;
                if (result.$has('admins')) {
                    return result.$get('admins').then(function (admins) {
                        scope.admins = admins;
                        return $q.all(Array.from(admins).map(function (m) {
                            return m.$get('company');
                        })).then(function (companies) {
                            return pickCompanyModal(companies);
                        });
                    });
                } else {
                    return scope.admin = result;
                }
            }, function () {
                return loginModal();
            });
        };

        var pickCompanyModal = function pickCompanyModal(_companies) {
            var modalInstance = $uibModal.open({
                templateUrl: 'pick_company_modal_form.html',
                controller: pickCompanyController,
                resolve: {
                    companies: function companies() {
                        return _companies;
                    }
                }
            });
            return modalInstance.result.then(function (company_id) {
                scope.companyId = company_id;
                return tryLogin();
            }, function () {
                return pickCompanyModal();
            });
        };

        var tryLogin = function tryLogin() {
            var login_form = {
                email: scope.adminEmail,
                password: scope.adminPassword
            };
            var options = { company_id: scope.companyId };
            return BBModel.Admin.Login.$login(login_form, options).then(function (result) {
                if (result.$has('admins')) {
                    return result.$get('admins').then(function (admins) {
                        scope.admins = admins;
                        return $q.all(Array.from(admins).map(function (a) {
                            return a.$get('company');
                        })).then(function (companies) {
                            return pickCompanyModal(companies);
                        });
                    });
                } else {
                    return scope.admin = result;
                }
            }, function (err) {
                return loginModal();
            });
        };

        if (scope.adminEmail && scope.adminPassword) {
            return tryLogin();
        } else {
            return loginModal();
        }
    };

    return {
        link: link,
        scope: {
            adminEmail: '@',
            adminPassword: '@',
            companyId: '@',
            apiUrl: '@',
            admin: '='
        },
        transclude: true,
        template: '<div ng-hide=\'admin\'><img src=\'/BB_wait.gif\' class="loader"></div>\n<div ng-show=\'admin\' ng-transclude></div>'
    };
});
'use strict';

angular.module('BBAdmin.Directives').directive('bbAdminSsoLogin', function ($rootScope, BBModel, QueryStringService, halClient) {

    return {
        restrict: 'EA',
        scope: {
            token: '@bbAdminSsoLogin',
            companyId: '@',
            apiUrl: '@'
        },
        transclude: true,
        template: '<div ng-if=\'admin\' ng-transclude></div>',

        link: function link(scope, element, attrs) {
            var api_host = void 0;
            scope.qs = QueryStringService;
            var data = {};
            if (scope.qs) {
                data.token = scope.qs('sso_token');
            }
            if (scope.token) {
                if (!data.token) {
                    data.token = scope.token;
                }
            }
            if (scope.apiUrl) {
                api_host = scope.apiUrl;
            }
            if (!api_host) {
                api_host = $rootScope.bb.api_url;
            }
            var url = api_host + '/api/v1/login/admin_sso/' + scope.companyId;
            return halClient.$post(url, {}, data).then(function (login) {
                var params = { auth_token: login.auth_token };
                return login.$get('administrator', params).then(function (admin) {
                    scope.admin = admin;
                    return BBModel.Admin.Login.$setLogin(admin);
                });
            });
        }
    };
});
'use strict';

angular.module('BBAdmin').directive('bookingTable', function (BBModel, ModalForm) {

    var controller = function controller($scope) {

        $scope.fields = ['id', 'datetime'];

        $scope.getBookings = function () {
            var params = { company: $scope.company };
            return BBModel.Admin.Booking.$query(params).then(function (bookings) {
                return $scope.bookings = bookings.items;
            });
        };

        $scope.newBooking = function () {
            return ModalForm.new({
                company: $scope.company,
                title: 'New Booking',
                new_rel: 'new_booking',
                post_rel: 'bookings',
                success: function success(booking) {
                    return $scope.bookings.push(booking);
                }
            });
        };

        return $scope.edit = function (booking) {
            return ModalForm.edit({
                model: booking,
                title: 'Edit Booking'
            });
        };
    };

    var link = function link(scope, element, attrs) {
        if (scope.company) {
            return scope.getBookings();
        } else {
            return BBModel.Admin.Company.$query(attrs).then(function (company) {
                scope.company = company;
                return scope.getBookings();
            });
        }
    };

    return {
        controller: controller,
        link: link,
        templateUrl: 'booking_table_main.html'
    };
});
'use strict';

angular.module('BBAdmin.Directives').directive('bbPeopleList', function ($rootScope) {
    return {
        restrict: 'AE',
        replace: true,
        scope: true,
        controller: function controller($scope, $rootScope, PersonService, $q, BBModel, PersonModel) {
            $rootScope.connection_started.then(function () {
                return $scope.bb.company.$getPeople().then(function (people) {
                    $scope.people = people;
                    return Array.from(people).map(function (person) {
                        return person.show = true;
                    });
                });
            });
            $scope.show_all_people = function () {
                return Array.from($scope.people).map(function (x) {
                    return x.show = true;
                });
            };
            return $scope.hide_all_people = function () {
                return Array.from($scope.people).map(function (x) {
                    return x.show = false;
                });
            };
        },
        link: function link(scope, element, attrs) {}
    };
});

angular.module('BBAdmin.Directives').directive('bbBookingList', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            bookings: '=',
            cancelled: '=',
            params: '='
        },

        templateUrl: function templateUrl(tElm, tAttrs) {
            return tAttrs.template;
        },
        controller: function controller($scope, $filter) {
            $scope.title = $scope.params.title;
            var status = $scope.params.status;


            return $scope.$watch(function () {
                return $scope.bookings;
            }, function () {
                var bookings = $scope.bookings;
                var cancelled = $scope.cancelled;

                if (cancelled == null) {
                    cancelled = false;
                }

                if (bookings != null) {
                    bookings = $filter('filter')(bookings, function (booking) {
                        var ret = booking.is_cancelled === cancelled;
                        if (status != null) {
                            ret &= booking.hasStatus(status);
                        } else {
                            ret &= booking.multi_status == null || Object.keys(booking.multi_status).length === 0;
                        }
                        ret &= booking.status === 4;
                        return ret;
                    });

                    $scope.relevantBookings = $filter('orderBy')(bookings, 'datetime');
                }

                return $scope.relevantBookings != null ? $scope.relevantBookings : $scope.relevantBookings = [];
            });
        }
    };
});
'use strict';

angular.module('BBAdmin').filter('rag', function () {
    return function (value, v1, v2) {
        if (value <= v1) {
            return "red";
        } else if (value <= v2) {
            return "amber";
        } else {
            return "green";
        }
    };
});

angular.module('BBAdmin').filter('gar', function () {
    return function (value, v1, v2) {
        if (value <= v1) {
            return "green";
        } else if (value <= v2) {
            return "amber";
        } else {
            return "red";
        }
    };
});

angular.module('BBAdmin').filter('time', function ($window) {
    return function (v) {
        return $window.sprintf("%02d:%02d", Math.floor(v / 60), v % 60);
    };
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('BB.Models').factory("AdminAdministratorModel", function ($q, BBModel, BaseModel) {
  return function (_BaseModel) {
    _inherits(Administrator, _BaseModel);

    function Administrator() {
      _classCallCheck(this, Administrator);

      return _possibleConstructorReturn(this, _BaseModel.apply(this, arguments));
    }

    return Administrator;
  }(BaseModel);
});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('BB.Models').factory("AdminBookingModel", function ($q, BBModel, BaseModel, BookingCollections, $window) {
    return function (_BaseModel) {
        _inherits(Admin_Booking, _BaseModel);

        function Admin_Booking(data) {
            _classCallCheck(this, Admin_Booking);

            var _this = _possibleConstructorReturn(this, _BaseModel.apply(this, arguments));

            _this.type = 'Admin_Booking';
            _this.datetime = moment(_this.datetime);
            _this.start = _this.datetime;
            _this.end = moment(_this.end_datetime);
            if (!_this.end) {
                _this.end = _this.datetime.clone().add(_this.duration, 'minutes');
            }
            _this.title = _this.full_describe;
            _this.time = _this.start.hour() * 60 + _this.start.minute();
            // this.startEditable  = false
            // this.durationEditable  = false
            // set to all day if it's a 24 hours span
            _this.allDay = _this.duration_span && _this.duration_span === 86400;

            if (_this.status === 3) {
                _this.startEditable = true;
                _this.durationEditable = true;
                _this.className = "status_blocked";
            } else if (_this.status === 4) {
                _this.className = "status_booked";
            } else if (_this.status === 0) {
                _this.className = "status_available";
            }
            if (_this.current_multi_status) {
                _this.className = 'status_' + _this.current_multi_status;
            }

            return _this;
        }

        Admin_Booking.prototype.useFullTime = function useFullTime() {
            this.using_full_time = true;
            if (this.pre_time) {
                this.start = this.datetime.clone().subtract(this.pre_time, 'minutes');
            }
            if (this.post_time) {
                return this.end = this.datetime.clone().add(this.duration + this.post_time, 'minutes');
            }
        };

        Admin_Booking.prototype.getPostData = function getPostData() {
            var data = {};
            if (this.date && this.time) {
                data.date = this.date.date.toISODate();
                data.time = this.time.time;
                if (this.time.event_id) {
                    data.event_id = this.time.event_id;
                } else if (this.time.event_ids) {
                    // what's this about?
                    data.event_ids = this.time.event_ids;
                }
            } else {
                this.datetime = this.start.clone();
                if (this.using_full_time) {
                    // we need to make sure if @start has changed - that we're adjusting for a possible pre-time
                    this.datetime.add(this.pre_time, 'minutes');
                }
                data.date = this.datetime.format("YYYY-MM-DD");
                data.time = this.datetime.hour() * 60 + this.datetime.minute();
            }
            data.duration = this.duration;
            data.id = this.id;
            data.pre_time = this.pre_time;
            data.post_time = this.post_time;
            data.person_id = this.person_id;
            data.resource_id = this.resource_id;
            data.child_client_ids = this.child_client_ids;
            data.people_ids = this.people_ids;
            if (this.questions) {
                data.questions = Array.from(this.questions).map(function (q) {
                    return q.getPostData();
                });
            }
            return data;
        };

        Admin_Booking.prototype.hasStatus = function hasStatus(status) {
            return this.multi_status[status] != null;
        };

        Admin_Booking.prototype.labelStatus = function labelStatus() {
            return BBLabelStatus.labelStatus(this.current_multi_status);
        };

        Admin_Booking.prototype.statusTime = function statusTime(status) {
            if (this.multi_status[status]) {
                return moment(this.multi_status[status]);
            } else {
                return null;
            }
        };

        Admin_Booking.prototype.sinceStatus = function sinceStatus(status) {
            var s = this.statusTime(status);
            if (!s) {
                return 0;
            }
            return Math.floor((moment().unix() - s.unix()) / 60);
        };

        Admin_Booking.prototype.sinceStart = function sinceStart(options) {
            var s = void 0;
            var start = this.datetime.unix();
            if (!options) {
                return Math.floor((moment().unix() - start) / 60);
            }
            if (options.later) {
                s = this.statusTime(options.later).unix();
                if (s > start) {
                    return Math.floor((moment().unix() - s) / 60);
                }
            }
            if (options.earlier) {
                s = this.statusTime(options.earlier).unix();
                if (s < start) {
                    return Math.floor((moment().unix() - s) / 60);
                }
            }
            return Math.floor((moment().unix() - start) / 60);
        };

        Admin_Booking.prototype.answer = function answer(q) {
            if (this.answers_summary) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Array.from(this.answers_summary)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var a = _step.value;

                        if (a.name === q) {
                            return a.answer;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
            return null;
        };

        Admin_Booking.prototype.$update = function $update(data) {
            var _this2 = this;

            var defer = $q.defer();
            if (data) {
                data.datetime = moment(data.datetime);
                data.datetime.tz();
                data.datetime = data.datetime.format();
            }
            if (!data) {
                data = this.getPostData();
            }
            this.$put('self', {}, data).then(function (res) {
                _this2.constructor(res);
                if (_this2.using_full_time) {
                    _this2.useFullTime();
                }
                BookingCollections.checkItems(_this2);
                return defer.resolve(_this2);
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        };

        Admin_Booking.prototype.$refetch = function $refetch() {
            var _this3 = this;

            var defer = $q.defer();
            this.$flush('self');
            this.$get('self').then(function (res) {
                _this3.constructor(res);
                if (_this3.using_full_time) {
                    _this3.useFullTime();
                }
                BookingCollections.checkItems(_this3);
                return defer.resolve(_this3);
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        };

        Admin_Booking.$query = function $query(params) {
            var company = void 0;
            if (params.slot) {
                params.slot_id = params.slot.id;
            }
            if (params.date) {
                params.start_date = params.date;
                params.end_date = params.date;
            }
            if (params.company) {
                company = params.company;

                delete params.company;
                params.company_id = company.id;
            }
            if (params.per_page == null) {
                params.per_page = 1024;
            }
            if (params.include_cancelled == null) {
                params.include_cancelled = false;
            }
            var defer = $q.defer();
            var existing = BookingCollections.find(params);
            if (existing && !params.skip_cache) {
                defer.resolve(existing);
            } else {
                var src = company;
                if (!src) {
                    src = params.src;
                }
                if (params.src) {
                    delete params.src;
                }
                if (params.skip_cache) {
                    if (existing) {
                        BookingCollections.delete(existing);
                    }
                    src.$flush('bookings', params);
                }

                src.$get('bookings', params).then(function (resource) {
                    if (resource.$has('bookings')) {
                        return resource.$get('bookings').then(function (bookings) {
                            var models = Array.from(bookings).map(function (b) {
                                return new BBModel.Admin.Booking(b);
                            });
                            var spaces = new $window.Collection.Booking(resource, models, params);
                            BookingCollections.add(spaces);
                            return defer.resolve(spaces);
                        }, function (err) {
                            return defer.reject(err);
                        });
                    } else {
                        var booking = new BBModel.Admin.Booking(resource);
                        return defer.resolve(booking);
                    }
                }, function (err) {
                    return defer.reject(err);
                });
            }
            return defer.promise;
        };

        return Admin_Booking;
    }(BaseModel);
});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('BB.Models').factory("AdminClientModel", function (ClientModel, $q, BBModel, $log, $window, ClientCollections, $rootScope, UriTemplate, halClient) {
    return function (_ClientModel) {
        _inherits(Admin_Client, _ClientModel);

        function Admin_Client(data) {
            _classCallCheck(this, Admin_Client);

            return _possibleConstructorReturn(this, _ClientModel.call(this, data));
        }

        Admin_Client.$query = function $query(params) {
            var company = params.company;

            var defer = $q.defer();

            if (company.$has('client')) {

                //if params.flush
                //  company.$flush('client', params)

                // have to use a hard coded api ref for now until all servers also have the {/id} in the href

                var url = "";
                if ($rootScope.bb.api_url) {
                    url = $rootScope.bb.api_url;
                }
                var href = url + "/api/v1/admin/{company_id}/client{/id}{?page,per_page,filter_by,filter_by_fields,order_by,order_by_reverse,search_by_fields,default_company_id}";
                params.company_id = company.id;
                var uri = new UriTemplate(href).fillFromObject(params || {});

                if (params.flush) {
                    halClient.clearCache(uri);
                }

                //company.$get('client', params).then (resource) ->
                halClient.$get(uri, {}).then(function (resource) {
                    if (resource.$has('clients')) {
                        return resource.$get('clients').then(function (clients) {
                            var models = Array.from(clients).map(function (c) {
                                return new BBModel.Admin.Client(c);
                            });

                            clients = new $window.Collection.Client(resource, models, params);
                            clients.total_entries = resource.total_entries;
                            ClientCollections.add(clients);
                            return defer.resolve(clients);
                        }, function (err) {
                            return defer.reject(err);
                        });
                    } else {
                        var client = new BBModel.Admin.Client(resource);
                        return defer.resolve(client);
                    }
                }, function (err) {
                    return defer.reject(err);
                });
            } else {
                $log.warn('company has no client link');
                defer.reject('company has no client link');
            }
            return defer.promise;
        };

        return Admin_Client;
    }(ClientModel);
});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('BB.Models').factory("AdminCompanyModel", function (CompanyModel, AdminCompanyService, BookingCollections, $q, BBModel) {
    return function (_CompanyModel) {
        _inherits(Admin_Company, _CompanyModel);

        function Admin_Company(data) {
            _classCallCheck(this, Admin_Company);

            return _possibleConstructorReturn(this, _CompanyModel.call(this, data));
        }

        Admin_Company.prototype.getBooking = function getBooking(id) {
            var defer = $q.defer();
            this.$get('bookings', { id: id }).then(function (booking) {
                var model = new BBModel.Admin.Booking(booking);
                BookingCollections.checkItems(model);
                return defer.resolve(model);
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        };

        Admin_Company.$query = function $query(params) {
            return AdminCompanyService.query(params);
        };

        return Admin_Company;
    }(CompanyModel);
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('BB.Models').factory("AdminLoginModel", function ($q, AdminLoginService, BBModel, BaseModel) {
    return function (_BaseModel) {
        _inherits(Admin_Login, _BaseModel);

        function Admin_Login(data) {
            _classCallCheck(this, Admin_Login);

            return _possibleConstructorReturn(this, _BaseModel.call(this, data));
        }

        Admin_Login.$login = function $login(form, options) {
            return AdminLoginService.login(form, options);
        };

        Admin_Login.$ssoLogin = function $ssoLogin(options, data) {
            return AdminLoginService.ssoLogin(options, data);
        };

        Admin_Login.$isLoggedIn = function $isLoggedIn() {
            return AdminLoginService.isLoggedIn();
        };

        Admin_Login.$setLogin = function $setLogin(user) {
            return AdminLoginService.setLogin(user);
        };

        Admin_Login.$user = function $user() {
            return AdminLoginService.user();
        };

        Admin_Login.$checkLogin = function $checkLogin(params) {
            return AdminLoginService.checkLogin(params);
        };

        Admin_Login.$logout = function $logout() {
            return AdminLoginService.logout();
        };

        Admin_Login.$getLogin = function $getLogin(options) {
            return AdminLoginService.getLogin(options);
        };

        Admin_Login.$companyLogin = function $companyLogin(company, params) {
            return AdminLoginService.companyLogin(company, params);
        };

        Admin_Login.$memberQuery = function $memberQuery(params) {
            return AdminLoginService.memberQuery(params);
        };

        Admin_Login.$setCompany = function $setCompany(company_id) {
            return AdminLoginService.setCompany(company_id);
        };

        return Admin_Login;
    }(BaseModel);
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('BB.Models').factory("AdminSlotModel", function ($q, BBModel, BaseModel, TimeSlotModel, SlotCollections, $window) {
    return function (_TimeSlotModel) {
        _inherits(Admin_Slot, _TimeSlotModel);

        function Admin_Slot(data) {
            _classCallCheck(this, Admin_Slot);

            var _this = _possibleConstructorReturn(this, _TimeSlotModel.call(this, data));

            _this.title = _this.full_describe;
            if (_this.status === 0) {
                _this.title = "Available";
            }
            _this.datetime = moment(_this.datetime);
            _this.start = _this.datetime;
            _this.end = _this.end_datetime;
            _this.end = _this.datetime.clone().add(_this.duration, 'minutes');
            _this.time = _this.start.hour() * 60 + _this.start.minute();
            _this.title = _this.full_describe;
            //   @startEditable  = false
            //   @durationEditable  = false
            // set to all day if it's a 24 hours span
            _this.allDay = false;
            if (_this.duration_span && _this.duration_span === 86400) {
                _this.allDay = true;
            }
            if (_this.status === 3) {
                _this.startEditable = true;
                _this.durationEditable = true;
                _this.className = "status_blocked";
            } else if (_this.status === 4) {
                _this.className = "status_booked";
            } else if (_this.status === 0) {
                _this.className = "status_available";
            }
            if (_this.current_multi_status) {
                _this.className = "status_" + _this.current_multi_status;
            }
            return _this;
        }

        Admin_Slot.prototype.useFullTime = function useFullTime() {
            this.using_full_time = true;
            if (this.pre_time) {
                this.start = this.datetime.clone().subtract(this.pre_time, 'minutes');
            }
            if (this.post_time) {
                return this.end = this.datetime.clone().add(this.duration + this.post_time, 'minutes');
            }
        };

        Admin_Slot.prototype.$refetch = function $refetch() {
            var _this2 = this;

            var defer = $q.defer();
            this.$flush('self');
            this.$get('self').then(function (res) {
                _this2.constructor(res);
                if (_this2.using_full_time) {
                    _this2.useFullTime();
                }
                BookingCollections.checkItems(_this2);
                return defer.resolve(_this2);
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        };

        Admin_Slot.$query = function $query(params) {
            var company = void 0;
            if (params.slot) {
                params.slot_id = params.slot.id;
            }
            if (params.date) {
                params.start_date = params.date;
                params.end_date = params.date;
            }
            if (params.company) {
                company = params.company;

                delete params.company;
                params.company_id = company.id;
            }
            if (params.per_page == null) {
                params.per_page = 1024;
            }
            if (params.include_cancelled == null) {
                params.include_cancelled = false;
            }
            var defer = $q.defer();
            var existing = SlotCollections.find(params);
            if (existing && !params.skip_cache) {
                defer.resolve(existing);
            } else {
                var src = company;
                if (!src) {
                    src = params.src;
                }
                if (params.src) {
                    delete params.src;
                }
                if (params.skip_cache) {
                    if (existing) {
                        SlotCollections.delete(existing);
                    }
                    src.$flush('slots', params);
                }

                src.$get('slots', params).then(function (resource) {
                    if (resource.$has('slots')) {
                        return resource.$get('slots').then(function (slots) {
                            var models = Array.from(slots).map(function (b) {
                                return new BBModel.Admin.Slot(b);
                            });
                            var spaces = new $window.Collection.Slot(resource, models, params);
                            SlotCollections.add(spaces);
                            return defer.resolve(spaces);
                        }, function (err) {
                            return defer.reject(err);
                        });
                    } else {
                        var slot = new BBModel.Admin.Slot(resource);
                        return defer.resolve(slot);
                    }
                }, function (err) {
                    return defer.reject(err);
                });
            }
            return defer.promise;
        };

        return Admin_Slot;
    }(TimeSlotModel);
});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

angular.module('BB.Models').factory("AdminUserModel", function ($q, BBModel, BaseModel) {
    'ngInject';

    var User = function (_BaseModel) {
        _inherits(User, _BaseModel);

        function User(data) {
            _classCallCheck(this, User);

            var _this = _possibleConstructorReturn(this, _BaseModel.call(this, data));

            _this.isParent = false;
            return _this;
        }

        User.prototype.setParentRole = function setParentRole() {
            var isParent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.isParent = isParent;
        };

        User.prototype.getOriginalRole = function getOriginalRole() {
            return this.role;
        };

        User.prototype.getRole = function getRole() {
            if (this.isParent) return 'parent-' + this.role;
            return this.role;
        };

        return User;
    }(BaseModel);

    return User;
});
'use strict';

angular.module('BBAdmin.Services').factory("AdminLoginService", function ($q, halClient, $rootScope, BBModel, $sessionStorage, $cookies, UriTemplate, shared_header) {

    return {
        login: function login(form, options) {
            var _this = this;

            var login_model = void 0;
            var deferred = $q.defer();
            var url = $rootScope.bb.api_url + '/api/v1/login/admin';
            if (options != null && options.company_id != null) {
                url = url + '/' + options.company_id;
            }

            halClient.$post(url, options, form).then(function (login) {
                if (login.$has('administrator')) {
                    return login.$get('administrator').then(function (user) {
                        // user.setOption('auth_token', login.getOption('auth_token'))
                        user = _this.setLogin(user);
                        return deferred.resolve(user);
                    });
                } else if (login.$has('administrators')) {
                    login_model = new BBModel.Admin.Login(login);
                    return deferred.resolve(login_model);
                } else {
                    return deferred.reject("No admin account for login");
                }
            }, function (err) {
                if (err.status === 400) {
                    var login = halClient.$parse(err.data);
                    if (login.$has('administrators')) {
                        login_model = new BBModel.Admin.Login(login);
                        return deferred.resolve(login_model);
                    } else {
                        return deferred.reject(err);
                    }
                } else {
                    return deferred.reject(err);
                }
            });
            return deferred.promise;
        },
        ssoLogin: function ssoLogin(options, data) {
            var _this2 = this;

            var deferred = $q.defer();
            var url = $rootScope.bb.api_url + "/api/v1/login/sso/" + options['company_id'];

            halClient.$post(url, {}, data).then(function (login) {
                return login.$get('user').then(function (user) {
                    user = _this2.setLogin(user);
                    return deferred.resolve(user);
                });
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        isLoggedIn: function isLoggedIn() {
            var deferred = $q.defer();
            this.checkLogin().then(function () {
                if ($rootScope.user) {
                    return deferred.resolve(true);
                } else {
                    return deferred.reject(false);
                }
            }, function (err) {
                return deferred.reject(false);
            });
            return deferred.promise;
        },
        setLogin: function setLogin(user) {
            user = new BBModel.Admin.User(user);
            var auth_token = user.getOption('auth_token');
            $sessionStorage.setItem("user", user.$toStore());
            $sessionStorage.setItem("auth_token", auth_token);
            $rootScope.user = user;
            return user;
        },
        user: function user() {
            return this.checkLogin().then(function () {
                return $rootScope.user;
            });
        },
        checkLogin: function checkLogin(params) {
            if (params == null) {
                params = {};
            }
            var defer = $q.defer();
            if ($rootScope.user) {
                defer.resolve();
            }
            var user = $sessionStorage.getItem("user");
            if (user) {
                $rootScope.user = new BBModel.Admin.User(halClient.createResource(user));
                defer.resolve();
            } else {
                var auth_token = $cookies.get('Auth-Token');
                if (auth_token) {
                    var url = void 0;
                    if ($rootScope.bb.api_url) {
                        url = $rootScope.bb.api_url + '/api/v1/login{?id,role}';
                    } else {
                        url = "/api/v1/login{?id,role}";
                    }
                    params.id = params.companyId || params.company_id;
                    params.role = 'admin';
                    var href = new UriTemplate(url).fillFromObject(params || {});
                    var options = { auth_token: auth_token };
                    halClient.$get(href, options).then(function (login) {
                        if (login.$has('administrator')) {
                            return login.$get('administrator').then(function (user) {
                                $rootScope.user = new BBModel.Admin.User(user);
                                return defer.resolve();
                            });
                        } else {
                            return defer.resolve();
                        }
                    }, function () {
                        return defer.resolve();
                    });
                } else {
                    defer.resolve();
                }
            }
            return defer.promise;
        },
        logout: function logout() {
            var defer = $q.defer();
            var url = $rootScope.bb.api_url + '/api/v1/login';
            halClient.$del(url).finally(function () {
                $rootScope.user = null;
                $sessionStorage.removeItem("user");
                $sessionStorage.removeItem("auth_token");
                $sessionStorage.removeItem('sso_token');
                $cookies.remove('Auth-Token');
                shared_header.del('auth_token');

                return defer.resolve();
            }, function () {
                return defer.reject();
            });
            return defer.promise;
        },
        getLogin: function getLogin(options) {
            var _this3 = this;

            var defer = $q.defer();
            var url = $rootScope.bb.api_url + '/api/v1/login/admin/' + options.company_id;
            halClient.$get(url, options).then(function (login) {
                if (login.$has('administrator')) {
                    return login.$get('administrator').then(function (user) {
                        user = _this3.setLogin(user);
                        return defer.resolve(user);
                    }, function (err) {
                        return defer.reject(err);
                    });
                } else {
                    return defer.reject();
                }
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        },
        setCompany: function setCompany(company_id) {
            var _this4 = this;

            var defer = $q.defer();
            var url = $rootScope.bb.api_url + '/api/v1/login/admin';
            var params = { company_id: company_id };
            halClient.$put(url, {}, params).then(function (login) {
                if (login.$has('administrator')) {
                    return login.$get('administrator').then(function (user) {
                        user = _this4.setLogin(user);
                        return defer.resolve(user);
                    }, function (err) {
                        return defer.reject(err);
                    });
                } else {
                    return defer.reject();
                }
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        }
    };
});
'use strict';

angular.module('BBAdmin.Services').factory('AdminBookingService', function ($q, $window, halClient, BookingCollections, BBModel, UriTemplate) {

    return {
        query: function query(prms) {

            var company = void 0;
            if (prms.slot) {
                prms.slot_id = prms.slot.id;
            }
            if (prms.date) {
                prms.start_date = prms.date;
                prms.end_date = prms.date;
            }
            if (prms.company) {
                company = prms.company;

                delete prms.company;
                prms.company_id = company.id;
            }

            if (prms.per_page == null) {
                prms.per_page = 1024;
            }
            if (prms.include_cancelled == null) {
                prms.include_cancelled = false;
            }

            var deferred = $q.defer();
            var existing = BookingCollections.find(prms);
            if (existing && !prms.skip_cache) {
                deferred.resolve(existing);
            } else if (company) {
                if (prms.skip_cache) {
                    if (existing) {
                        BookingCollections.delete(existing);
                    }
                    company.$flush('bookings', prms);
                }
                company.$get('bookings', prms).then(function (collection) {
                    return collection.$get('bookings').then(function (bookings) {
                        var models = Array.from(bookings).map(function (b) {
                            return new BBModel.Admin.Booking(b);
                        });
                        var spaces = new $window.Collection.Booking(collection, models, prms);
                        BookingCollections.add(spaces);
                        return deferred.resolve(spaces);
                    }, function (err) {
                        return deferred.reject(err);
                    });
                }, function (err) {
                    return deferred.reject(err);
                });
            } else {
                var url = "";
                if (prms.url) {
                    url = prms.url;
                }
                var href = url + "/api/v1/admin/{company_id}/bookings{?slot_id,start_date,end_date,service_id,resource_id,person_id,page,per_page,include_cancelled,embed,client_id}";
                var uri = new UriTemplate(href).fillFromObject(prms || {});

                halClient.$get(uri, {}).then(function (found) {
                    return found.$get('bookings').then(function (items) {
                        var sitems = [];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = Array.from(items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var item = _step.value;

                                sitems.push(new BBModel.Admin.Booking(item));
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        var spaces = new $window.Collection.Booking(found, sitems, prms);
                        BookingCollections.add(spaces);
                        return deferred.resolve(spaces);
                    });
                }, function (err) {
                    return deferred.reject(err);
                });
            }

            return deferred.promise;
        },
        getBooking: function getBooking(prms) {
            var deferred = $q.defer();
            if (prms.company && !prms.company_id) {
                prms.company_id = prms.company.id;
            }

            var url = "";
            if (prms.url) {
                url = prms.url;
            }
            var href = url + "/api/v1/admin/{company_id}/bookings/{id}{?embed}";
            var uri = new UriTemplate(href).fillFromObject(prms || {});
            halClient.$get(uri, { no_cache: true }).then(function (item) {
                var booking = new BBModel.Admin.Booking(item);
                BookingCollections.checkItems(booking);
                return deferred.resolve(booking);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        cancelBooking: function cancelBooking(prms, booking) {
            var deferred = $q.defer();
            var href = "/api/v1/admin/{company_id}/bookings/{id}?notify={notify}";
            if (prms.id == null) {
                prms.id = booking.id;
            }

            var notify = prms.notify;

            if (notify == null) {
                notify = true;
            }

            var uri = new UriTemplate(href).fillFromObject(prms || {});
            halClient.$del(uri, { notify: notify }).then(function (item) {
                booking = new BBModel.Admin.Booking(item);
                BookingCollections.checkItems(booking);
                return deferred.resolve(booking);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        updateBooking: function updateBooking(prms, booking) {
            var deferred = $q.defer();
            var href = "/api/v1/admin/{company_id}/bookings/{id}";
            if (prms.id == null) {
                prms.id = booking.id;
            }

            var uri = new UriTemplate(href).fillFromObject(prms || {});
            halClient.$put(uri, {}, prms).then(function (item) {
                booking = new BBModel.Admin.Booking(item);
                BookingCollections.checkItems(booking);
                return deferred.resolve(booking);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        blockTimeForPerson: function blockTimeForPerson(prms, person) {
            var deferred = $q.defer();
            var href = "/api/v1/admin/{company_id}/people/{person_id}/block";
            if (prms.person_id == null) {
                prms.person_id = person.id;
            }
            prms.booking = true;
            var uri = new UriTemplate(href).fillFromObject(prms || {});
            halClient.$put(uri, {}, prms).then(function (item) {
                var booking = new BBModel.Admin.Booking(item);
                BookingCollections.checkItems(booking);
                return deferred.resolve(booking);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        addStatusToBooking: function addStatusToBooking(prms, booking, status) {
            var deferred = $q.defer();
            var href = "/api/v1/admin/{company_id}/bookings/{booking_id}/multi_status";
            if (prms.booking_id == null) {
                prms.booking_id = booking.id;
            }
            var uri = new UriTemplate(href).fillFromObject(prms || {});
            halClient.$put(uri, {}, { status: status }).then(function (item) {
                booking = new BBModel.Admin.Booking(item);
                BookingCollections.checkItems(booking);
                return deferred.resolve(booking);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        addPrivateNoteToBooking: function addPrivateNoteToBooking(prms, booking, note) {
            var noteParam = void 0;
            var deferred = $q.defer();
            var href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes";
            if (prms.booking_id == null) {
                prms.booking_id = booking.id;
            }

            if (note.note != null) {
                noteParam = note.note;
            }
            if (noteParam == null) {
                noteParam = note;
            }

            var uri = new UriTemplate(href).fillFromObject(prms || {});
            halClient.$put(uri, {}, { note: noteParam }).then(function (item) {
                booking = new BBModel.Admin.Booking(item);
                BookingCollections.checkItems(booking);
                return deferred.resolve(booking);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        updatePrivateNoteForBooking: function updatePrivateNoteForBooking(prms, booking, note) {
            var deferred = $q.defer();
            var href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes/{id}";
            if (prms.booking_id == null) {
                prms.booking_id = booking.id;
            }
            if (prms.id == null) {
                prms.id = note.id;
            }

            var uri = new UriTemplate(href).fillFromObject(prms || {});
            halClient.$put(uri, {}, { note: note.note }).then(function (item) {
                booking = new BBModel.Admin.Booking(item);
                BookingCollections.checkItems(booking);
                return deferred.resolve(booking);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        deletePrivateNoteFromBooking: function deletePrivateNoteFromBooking(prms, booking, note) {
            var deferred = $q.defer();
            var href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes/{id}";
            if (prms.booking_id == null) {
                prms.booking_id = booking.id;
            }
            if (prms.id == null) {
                prms.id = note.id;
            }

            var uri = new UriTemplate(href).fillFromObject(prms || {});
            halClient.$del(uri, {}).then(function (item) {
                booking = new BBModel.Admin.Booking(item);
                BookingCollections.checkItems(booking);
                return deferred.resolve(booking);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        }
    };
});
'use strict';

angular.module('BBAdmin.Services').factory('ColorPalette', function () {

    var colors = [{ primary: '#001F3F', secondary: '#80BFFF' }, // Navy
    { primary: '#FF4136', secondary: '#800600' }, // Red
    { primary: '#7FDBFF', secondary: '#004966' }, // Aqua
    { primary: '#3D9970', secondary: '#163728' }, // Olive
    { primary: '#85144B', secondary: '#EB7AB1' }, // Maroon
    { primary: '#2ECC40', secondary: '#0E3E14' }, // Green
    { primary: '#FF851B', secondary: '#663000' // Orange
    }];

    return {
        setColors: function setColors(models) {
            return _.each(models, function (model, i) {
                var color = colors[i % colors.length];
                model.color = color.primary;
                return model.textColor = color.secondary;
            });
        }
    };
});
'use strict';

angular.module('BBAdmin.Services').factory('AdminCompanyService', function ($q, $rootScope, $sessionStorage, BBModel, halClient, UriTemplate) {

    return {
        query: function query(params) {
            var defer = $q.defer();
            if (!$rootScope.bb) {
                $rootScope.bb = {};
            }

            if (!$rootScope.bb.api_url) {
                $rootScope.bb.api_url = $sessionStorage.getItem("host");
            }
            if (!$rootScope.bb.api_url) {
                $rootScope.bb.api_url = params.apiUrl;
            }
            if (!$rootScope.bb.api_url) {
                $rootScope.bb.api_url = "";
            }

            BBModel.Admin.Login.$checkLogin(params).then(function () {
                if ($rootScope.user && $rootScope.user.company_id) {
                    if (!$rootScope.bb) {
                        $rootScope.bb = {};
                    }
                    $rootScope.bb.company_id = $rootScope.user.company_id;
                    return $rootScope.user.$get('company').then(function (company) {
                        return defer.resolve(new BBModel.Admin.Company(company));
                    }, function (err) {
                        return defer.reject(err);
                    });
                } else {
                    var login_form = {
                        email: params.adminEmail,
                        password: params.adminPassword
                    };
                    var options = { company_id: params.companyId };
                    return BBModel.Admin.Login.$login(login_form, options).then(function (user) {
                        return user.$get('company').then(function (company) {
                            return defer.resolve(new BBModel.Admin.Company(company));
                        }, function (err) {
                            return defer.reject(err);
                        });
                    }, function (err) {
                        return defer.reject(err);
                    });
                }
            });
            return defer.promise;
        },
        buildCompanyModels: function buildCompanyModels(baseResources) {
            return Array.from(baseResources).map(function (company) {
                return new BBModel.Admin.Company(company);
            });
        },
        searchChildren: function searchChildren(params) {
            var _this = this;

            var searchChildrenPromise = $q.defer();
            var apiUrl = $rootScope.bb.api_url;
            var uri = apiUrl + ('/api/v1/company/' + params.companyId + '/search?company[text]=' + params.searchValue);
            halClient.$get(uri, {}).then(function (result) {
                return _this.handleCompanySearchResponse(result, searchChildrenPromise);
            }).catch(function (err) {
                return searchChildrenPromise.reject(err);
            });

            return searchChildrenPromise.promise;
        },
        handleCompanySearchResponse: function handleCompanySearchResponse(result, searchChildrenPromise) {
            var _this2 = this;

            if (result.$has('companies')) {
                result.$get('companies').then(function (companyBaseResources) {
                    var companyModels = _this2.buildCompanyModels(companyBaseResources);
                    searchChildrenPromise.resolve(companyModels);
                });
            } else {
                searchChildrenPromise.resolve();
            }
        }
    };
});
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

angular.module('BBAdmin.Services').factory('AdminDayService', function ($q, $window, halClient, BBModel, UriTemplate) {

    return {
        query: function query(prms) {
            var url = "";
            if (prms.url) {
                url = prms.url;
            }
            var href = url + "/api/v1/{company_id}/day_data{?month,week,date,edate,event_id,service_id}";

            var uri = new UriTemplate(href).fillFromObject(prms || {});
            var deferred = $q.defer();
            halClient.$get(uri, {}).then(function (found) {
                if (found.items) {
                    var _ret = function () {
                        var mdays = [];
                        // it has multiple days of data
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = Array.from(found.items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var item = _step.value;

                                halClient.$get(item.uri).then(function (data) {
                                    var days = [];
                                    var _iteratorNormalCompletion2 = true;
                                    var _didIteratorError2 = false;
                                    var _iteratorError2 = undefined;

                                    try {
                                        for (var _iterator2 = Array.from(data.days)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                            var i = _step2.value;

                                            if (i.type === prms.item) {
                                                days.push(new BBModel.Day(i));
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError2 = true;
                                        _iteratorError2 = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                                _iterator2.return();
                                            }
                                        } finally {
                                            if (_didIteratorError2) {
                                                throw _iteratorError2;
                                            }
                                        }
                                    }

                                    var dcol = new $window.Collection.Day(data, days, {});
                                    return mdays.push(dcol);
                                });
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        return {
                            v: deferred.resolve(mdays)
                        };
                    }();

                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                }
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        }
    };
});
'use strict';

angular.module('BBAdmin.Services').factory('AdminPurchaseService', function ($q, halClient, BBModel) {

    return {
        query: function query(params) {
            var defer = $q.defer();
            var uri = params.url_root + "/api/v1/admin/purchases/" + params.purchase_id;
            halClient.$get(uri, params).then(function (purchase) {
                purchase = new BBModel.Purchase.Total(purchase);
                return defer.resolve(purchase);
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        },
        markAsPaid: function markAsPaid(params) {
            var company_id = void 0;
            var defer = $q.defer();

            if (!params.purchase || !params.url_root) {
                defer.reject("invalid request");
                return defer.promise;
            }

            if (params.company) {
                company_id = params.company.id;
            }

            var uri = params.url_root + ('/api/v1/admin/' + company_id + '/purchases/' + params.purchase.id + '/pay');

            var data = {};
            if (params.company) {
                data.company_id = params.company.id;
            }
            if (params.notify_admin) {
                data.notify_admin = params.notify_admin;
            }
            if (params.payment_status) {
                data.payment_status = params.payment_status;
            }
            if (params.amount) {
                data.amount = params.amount;
            }
            if (params.notes) {
                data.notes = params.notes;
            }
            if (params.transaction_id) {
                data.transaction_id = params.transaction_id;
            }
            if (params.notify) {
                data.notify = params.notify;
            }
            if (params.payment_type) {
                data.payment_type = params.payment_type;
            }

            halClient.$put(uri, params, data).then(function (purchase) {
                purchase = new BBModel.Purchase.Total(purchase);
                return defer.resolve(purchase);
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        }
    };
});
'use strict';

angular.module('BBAdmin.Services').factory('AdminSlotService', function ($q, $window, halClient, SlotCollections, BBModel, UriTemplate) {

    return {
        query: function query(prms) {
            var deferred = $q.defer();

            // see if a colection of slots matching this quesry is already being monitored
            var existing = SlotCollections.find(prms);
            if (existing) {
                deferred.resolve(existing);
            } else if (prms.user) {
                prms.user.$get('company').then(function (company) {
                    return company.$get('slots', prms).then(function (slots_collection) {
                        return slots_collection.$get('slots').then(function (slots) {
                            var slot_models = Array.from(slots).map(function (s) {
                                return new BBModel.Admin.Slot(s);
                            });
                            return deferred.resolve(slot_models);
                        }, function (err) {
                            return deferred.reject(err);
                        });
                    });
                });
            } else {
                var url = "";
                if (prms.url) {
                    url = prms.url;
                }
                var href = url + "/api/v1/admin/{company_id}/slots{?start_date,end_date,date,service_id,resource_id,person_id,page,per_page}";
                var uri = new UriTemplate(href).fillFromObject(prms || {});

                halClient.$get(uri, {}).then(function (found) {
                    return found.$get('slots').then(function (items) {
                        var sitems = [];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = Array.from(items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var item = _step.value;

                                sitems.push(new BBModel.Admin.Slot(item));
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        var slots = new $window.Collection.Slot(found, sitems, prms);
                        SlotCollections.add(slots);
                        return deferred.resolve(slots);
                    });
                }, function (err) {
                    return deferred.reject(err);
                });
            }

            return deferred.promise;
        },
        create: function create(prms, data) {

            var url = "";
            if (prms.url) {
                url = prms.url;
            }
            var href = url + "/api/v1/admin/{company_id}/slots";
            var uri = new UriTemplate(href).fillFromObject(prms || {});

            var deferred = $q.defer();

            halClient.$post(uri, {}, data).then(function (slot) {
                slot = new BBModel.Admin.Slot(slot);
                SlotCollections.checkItems(slot);
                return deferred.resolve(slot);
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        },
        delete: function _delete(item) {

            var deferred = $q.defer();
            item.$del('self').then(function (slot) {
                slot = new BBModel.Admin.Slot(slot);
                SlotCollections.deleteItems(slot);
                return deferred.resolve(slot);
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        },
        update: function update(item, data) {

            var deferred = $q.defer();
            item.$put('self', {}, data).then(function (slot) {
                slot = new BBModel.Admin.Slot(slot);
                SlotCollections.checkItems(slot);
                return deferred.resolve(slot);
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        }
    };
});
'use strict';

angular.module('BBAdmin.Services').factory('AdminTimeService', function ($q, $window, halClient, BBModel, UriTemplate) {

    return {
        query: function query(prms) {
            if (prms.day) {
                prms.date = prms.day.date;
            }
            if (!prms.edate && prms.date) {
                prms.edate = prms.date;
            }
            var url = "";
            if (prms.url) {
                url = prms.url;
            }
            var href = url + "/api/v1/{company_id}/time_data{?date,event_id,service_id,person_id}";

            var uri = new UriTemplate(href).fillFromObject(prms || {});
            var deferred = $q.defer();
            halClient.$get(uri, { no_cache: false }).then(function (found) {
                return found.$get('events').then(function (events) {
                    var eventItems = [];
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = Array.from(events)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var eventItem = _step.value;

                            var event = {};
                            event.times = [];
                            event.event_id = eventItem.event_id;
                            event.person_id = found.person_id;
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = Array.from(eventItem.times)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var time = _step2.value;

                                    var ts = new BBModel.TimeSlot(time);
                                    event.times.push(ts);
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }

                            eventItems.push(event);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return deferred.resolve(eventItems);
                });
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        }
    };
});
'use strict';

angular.module('BB.Services').factory("BB.Service.login", function ($q, BBModel) {
    return {
        unwrap: function unwrap(resource) {
            return new BBModel.Admin.Login(resource);
        }
    };
});

angular.module('BB.Services').factory("BB.Service.base_login", function ($q, BBModel) {
    return {
        unwrap: function unwrap(resource) {
            return new BBModel.Admin.Login(resource);
        }
    };
});
"use strict";

angular.module("BBAdmin").config(function ($translateProvider) {
    "ngInject";

    var translations = {
        ADMIN: {
            CANCEL_BOOKING_MODAL: {
                TITLE: "Cancel Booking",
                REASON_LBL: "Cancel reason",
                SEND_EMAIL_LBL: "Send cancellation confirmation to {{email}}?",
                OK_BTN: "@:COMMON.BTN.OK",
                CLOSE_BTN: "@:COMMON.BTN.CLOSE"
            },
            LOGIN: {
                EMAIL_LBL: "@:COMMON.TERMINOLOGY.EMAIL",
                EMAIL_PLACEHOLDER: "@:COMMON.TERMINOLOGY.EMAIL",
                PASSWORD_LBL: "@:COMMON.FORM.PASSWORD",
                PASSWORD_PLACEHOLDER: "@:COMMON.FORM.PASSWORD",
                LOGIN_BTN: "@:COMMON.BTN.LOGIN"
            },
            PICK_COMPANY: {
                STEP_SUMMARY: "Pick Company",
                SELECT_BTN: "@:COMMON.BTN.SELECT"
            },
            BOOKNG_TABLE: {
                NEW_BOOKING_BTN: "New booking",
                EDIT_BTN: "@:COMMON.BTN.EDIT"
            }
        }
    };

    $translateProvider.translations("en", translations);
});