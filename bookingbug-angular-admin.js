(function() {
  'use strict';
  angular.module('BBAdmin').config(["$logProvider", function($logProvider) {
    'ngInject';
    $logProvider.debugEnabled(true);
  }]);

  angular.module('BB').config(["FormTransformProvider", function(FormTransformProvider) {
    'ngInject';
    FormTransformProvider.setTransform('edit', 'Admin_Booking', function(form, schema, model) {
      var disable_list;
      if (model && model.status === 3) {
        disable_list = ['service', 'person_id', 'resource_id'];
      } else {
        disable_list = ['datetime', 'service', 'person_id', 'resource_id'];
      }
      if (form[0].tabs) {
        _.each(form[0].tabs[0].items, function(item) {
          if (_.indexOf(disable_list, item.key) > -1) {
            return item.readonly = true;
          }
        });
      } else {
        _.each(form, function(item) {
          if (_.indexOf(disable_list, item.key) > -1) {
            return item.readonly = true;
          }
        });
      }
      return form;
    });
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Directives', 'BBAdmin.Controllers', 'BBAdmin.Models', 'BBAdmin.Directives', 'trNgGrid']);

  angular.module('BBAdmin.Directives', []);

  angular.module('BBAdmin.Filters', []);

  angular.module('BBAdmin.Models', []);

  angular.module('BBAdmin.Services', ['ngResource', 'ngSanitize']);

  angular.module('BBAdmin.Controllers', ['ngSanitize']);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').run(["$q", "$injector", "BBModel", function($q, $injector, BBModel) {
    'ngInject';
    var afuncs, i, len, model, models;
    models = ['Booking', 'Slot', 'User', 'Administrator', 'Schedule', 'Address', 'Resource', 'Person', 'Service', 'Login', 'EventChain', 'EventGroup', 'Event', 'Clinic', 'Company', 'Client'];
    afuncs = {};
    for (i = 0, len = models.length; i < len; i++) {
      model = models[i];
      afuncs[model] = $injector.get("Admin" + model + "Model");
    }
    BBModel['Admin'] = afuncs;
  }]);

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Booking = (function(superClass) {
    extend(Booking, superClass);

    function Booking() {
      return Booking.__super__.constructor.apply(this, arguments);
    }

    Booking.prototype.checkItem = function(item) {
      return Booking.__super__.checkItem.apply(this, arguments);
    };

    Booking.prototype.matchesParams = function(item) {
      if ((this.params.start_date != null) && item.start) {
        if (this.start_date == null) {
          this.start_date = moment(this.params.start_date);
        }
        if (this.start_date.isAfter(item.start)) {
          return false;
        }
      }
      if ((this.params.end_date != null) && item.start) {
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

  })(window.Collection.Base);

  angular.module('BB.Services').provider("BookingCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Client = (function(superClass) {
    extend(Client, superClass);

    function Client() {
      return Client.__super__.constructor.apply(this, arguments);
    }

    Client.prototype.checkItem = function(item) {
      return Client.__super__.checkItem.apply(this, arguments);
    };

    return Client;

  })(window.Collection.Base);

  angular.module('BB.Services').provider("ClientCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Slot = (function(superClass) {
    extend(Slot, superClass);

    function Slot() {
      return Slot.__super__.constructor.apply(this, arguments);
    }

    Slot.prototype.checkItem = function(item) {
      return Slot.__super__.checkItem.apply(this, arguments);
    };

    Slot.prototype.matchesParams = function(item) {
      if (this.params.start_date) {
        this.start_date || (this.start_date = moment(this.params.start_date));
        if (this.start_date.isAfter(item.date)) {
          return false;
        }
      }
      if (this.params.end_date) {
        this.end_date || (this.end_date = moment(this.params.end_date));
        if (this.end_date.isBefore(item.date)) {
          return false;
        }
      }
      return true;
    };

    return Slot;

  })(window.Collection.Base);

  angular.module('BB.Services').provider("SlotCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('CalendarCtrl', ["$scope", "BBModel", "$rootScope", function($scope, BBModel, $rootScope) {
    $scope.eventsF = function(start, end, tz, callback) {
      var bookings, prms;
      prms = {
        company_id: 21
      };
      prms.start_date = start.format("YYYY-MM-DD");
      prms.end_date = end.format("YYYY-MM-DD");
      bookings = BBModel.Admin.Booking.$query(prms);
      return bookings.then((function(_this) {
        return function(s) {
          callback(s.items);
          return s.addCallback(function(booking) {
            return $scope.myCalendar.fullCalendar('renderEvent', booking, true);
          });
        };
      })(this));
    };
    $scope.dayClick = function(date, allDay, jsEvent, view) {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.alertMessage = 'Day Clicked ' + date;
        };
      })(this));
    };
    $scope.alertOnDrop = function(event, revertFunc, jsEvent, ui, view) {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.popupTimeAction({
            action: "move",
            booking: event,
            newdate: event.start,
            onCancel: revertFunc
          });
        };
      })(this));
    };
    $scope.alertOnResize = function(event, revertFunc, jsEvent, ui, view) {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.alertMessage = 'Event Resized ';
        };
      })(this));
    };
    $scope.addRemoveEventSource = function(sources, source) {
      var canAdd;
      canAdd = 0;
      angular.forEach(sources, (function(_this) {
        return function(value, key) {
          if (sources[key] === source) {
            sources.splice(key, 1);
            return canAdd = 1;
          }
        };
      })(this));
      if (canAdd === 0) {
        return sources.push(source);
      }
    };
    $scope.addEvent = function() {
      var m, y;
      y = '';
      m = '';
      return $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    $scope.remove = function(index) {
      return $scope.events.splice(index, 1);
    };
    $scope.changeView = function(view) {
      return $scope.myCalendar.fullCalendar('changeView', view);
    };
    $scope.eventClick = function(event, jsEvent, view) {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.selectBooking(event);
        };
      })(this));
    };
    $scope.selectTime = function(start, end, allDay) {
      return $scope.$apply((function(_this) {
        return function() {
          $scope.popupTimeAction({
            start_time: moment(start),
            end_time: moment(end),
            allDay: allDay
          });
          return $scope.myCalendar.fullCalendar('unselect');
        };
      })(this));
    };
    $scope.uiConfig = {
      calendar: {
        height: 450,
        editable: true,
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.dayClick,
        eventClick: $scope.eventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        selectable: true,
        selectHelper: true,
        select: $scope.selectTime
      }
    };
    return $scope.eventSources = [$scope.eventsF];
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('CategoryList', ["$scope", "$location", "$rootScope", "BBModel", function($scope, $location, $rootScope, BBModel) {
    $rootScope.connection_started.then((function(_this) {
      return function() {
        $scope.categories = BBModel.Category.$query($scope.bb.company);
        return $scope.categories.then(function(items) {});
      };
    })(this));
    $scope.$watch('selectedCategory', (function(_this) {
      return function(newValue, oldValue) {
        var items;
        $rootScope.category = newValue;
        return items = $('.inline_time').each(function(idx, e) {
          return angular.element(e).scope().clear();
        });
      };
    })(this));
    return $scope.$on("Refresh_Cat", (function(_this) {
      return function(event, message) {
        return $scope.$apply();
      };
    })(this));
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Directives').directive('bbAdminClients', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'AdminClients',
      link: function(scope, element, attrs) {}
    };
  });

  angular.module('BBAdmin.Controllers').controller('AdminClients', ["$scope", "$rootScope", "$q", "$log", "AlertService", "LoadingService", "BBModel", function($scope, $rootScope, $q, $log, AlertService, LoadingService, BBModel) {
    var loader;
    $scope.clientDef = $q.defer();
    $scope.clientPromise = $scope.clientDef.promise;
    $scope.per_page = 15;
    $scope.total_entries = 0;
    $scope.clients = [];
    loader = LoadingService.$loader($scope);
    $scope.getClients = function(currentPage, filterBy, filterByFields, orderBy, orderByReverse) {
      var clientDef;
      clientDef = $q.defer();
      $rootScope.connection_started.then(function() {
        var params;
        loader.notLoaded();
        params = {
          company: $scope.bb.company,
          per_page: $scope.per_page,
          page: currentPage + 1,
          filter_by: filterBy,
          filter_by_fields: filterByFields,
          order_by: orderBy,
          order_by_reverse: orderByReverse
        };
        return BBModel.Admin.Client.$query(params).then((function(_this) {
          return function(clients) {
            $scope.clients = clients.items;
            loader.setLoaded();
            $scope.setPageLoaded();
            $scope.total_entries = clients.total_entries;
            return clientDef.resolve(clients.items);
          };
        })(this), function(err) {
          clientDef.reject(err);
          return loader.setLoadedAndShowError(err, 'Sorry, something went wrong');
        });
      });
      return true;
    };
    return $scope.edit = function(item) {
      return $log.info("not implemented");
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('CompanyList', ["$scope", "$rootScope", "$location", function($scope, $rootScope, $location) {
    $scope.selectedCategory = null;
    $rootScope.connection_started.then((function(_this) {
      return function() {
        var d, date, end, results;
        date = moment();
        $scope.current_date = date;
        $scope.companies = $scope.bb.company.companies;
        if (!$scope.companies || $scope.companies.length === 0) {
          $scope.companies = [$scope.bb.company];
        }
        $scope.dates = [];
        end = moment(date).add(21, 'days');
        $scope.end_date = end;
        d = moment(date);
        results = [];
        while (d.isBefore(end)) {
          $scope.dates.push(d.clone());
          results.push(d.add(1, 'days'));
        }
        return results;
      };
    })(this));
    $scope.selectCompany = function(item) {
      return $location = "/view/dashboard/pick_company/" + item.id;
    };
    $scope.advance_date = function(num) {
      var d, date, results;
      date = $scope.current_date.add(num, 'days');
      $scope.end_date = moment(date).add(21, 'days');
      $scope.current_date = moment(date);
      $scope.dates = [];
      d = date.clone();
      results = [];
      while (d.isBefore($scope.end_date)) {
        $scope.dates.push(d.clone());
        results.push(d.add(1, 'days'));
      }
      return results;
    };
    return $scope.$on("Refresh_Comp", function(event, message) {
      return $scope.$apply();
    });
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('DashboardContainer', ["$scope", "$rootScope", "$location", "$uibModal", "$document", function($scope, $rootScope, $location, $uibModal, $document) {
    var ModalInstanceCtrl;
    $scope.selectedBooking = null;
    $scope.poppedBooking = null;
    $scope.selectBooking = function(booking) {
      return $scope.selectedBooking = booking;
    };
    $scope.popupBooking = function(booking) {
      var modalInstance;
      $scope.poppedBooking = booking;
      modalInstance = $uibModal.open({
        templateUrl: 'full_booking_details',
        controller: ModalInstanceCtrl,
        scope: $scope,
        backdrop: true,
        resolve: {
          items: (function(_this) {
            return function() {
              return {
                booking: booking
              };
            };
          })(this)
        }
      });
      return modalInstance.result.then((function(_this) {
        return function(selectedItem) {
          return $scope.selected = selectedItem;
        };
      })(this), (function(_this) {
        return function() {
          return console.log('Modal dismissed at: ' + new Date());
        };
      })(this));
    };
    ModalInstanceCtrl = function($scope, $uibModalInstance, items) {
      angular.extend($scope, items);
      $scope.ok = function() {
        if (items.booking && items.booking.self) {
          items.booking.$update();
        }
        return $uibModalInstance.close();
      };
      return $scope.cancel = function() {
        return $uibModalInstance.dismiss('cancel');
      };
    };
    return $scope.popupTimeAction = function(prms) {
      var modalInstance;
      return modalInstance = $uibModal.open({
        templateUrl: $scope.partial_url + 'time_popup',
        controller: ModalInstanceCtrl,
        scope: $scope,
        backdrop: false,
        resolve: {
          items: (function(_this) {
            return function() {
              return prms;
            };
          })(this)
        }
      });
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('DashDayList', ["$scope", "$rootScope", "$q", "BBModel", function($scope, $rootScope, $q, BBModel) {
    $scope.init = (function(_this) {
      return function(company_id) {
        var date, dayListDef, prms, weekListDef;
        $scope.inline_items = "";
        if (company_id) {
          $scope.bb.company_id = company_id;
        }
        if (!$scope.current_date) {
          $scope.current_date = moment().startOf('month');
        }
        date = $scope.current_date;
        prms = {
          date: date.format('DD-MM-YYYY'),
          company_id: $scope.bb.company_id
        };
        if ($scope.service_id) {
          prms.service_id = $scope.service_id;
        }
        if ($scope.end_date) {
          prms.edate = $scope.end_date.format('DD-MM-YYYY');
        }
        dayListDef = $q.defer();
        weekListDef = $q.defer();
        $scope.dayList = dayListDef.promise;
        $scope.weeks = weekListDef.promise;
        prms.url = $scope.bb.api_url;
        return BBModel.Admin.Day.$query(prms).then(function(days) {
          $scope.sdays = days;
          dayListDef.resolve();
          if ($scope.category) {
            return $scope.update_days();
          }
        });
      };
    })(this);
    $scope.format_date = (function(_this) {
      return function(fmt) {
        return $scope.current_date.format(fmt);
      };
    })(this);
    $scope.selectDay = (function(_this) {
      return function(day, dayBlock, e) {
        var elm, seldate, xelm;
        if (day.spaces === 0) {
          return false;
        }
        seldate = moment($scope.current_date);
        seldate.date(day.day);
        $scope.selected_date = seldate;
        elm = angular.element(e.toElement);
        elm.parent().children().removeClass("selected");
        elm.addClass("selected");
        xelm = $('#tl_' + $scope.bb.company_id);
        $scope.service_id = dayBlock.service_id;
        $scope.service = {
          id: dayBlock.service_id,
          name: dayBlock.name
        };
        $scope.selected_day = day;
        if (xelm.length === 0) {
          return $scope.inline_items = "/view/dash/time_small";
        } else {
          return xelm.scope().init(day);
        }
      };
    })(this);
    $scope.$watch('current_date', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue && $scope.bb.company_id) {
          return $scope.init();
        }
      };
    })(this));
    $scope.update_days = (function(_this) {
      return function() {
        var day, i, len, ref, results;
        $scope.dayList = [];
        $scope.service_id = null;
        ref = $scope.sdays;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          day = ref[i];
          if (day.category_id === $scope.category.id) {
            $scope.dayList.push(day);
            results.push($scope.service_id = day.id);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
    })(this);
    return $rootScope.$watch('category', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue && $scope.sdays) {
          return $scope.update_days();
        }
      };
    })(this));
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('EditBookingDetails', ["$scope", "$location", "$rootScope", function($scope, $location, $rootScope) {}]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Directives').directive('bbAdminLogin', function() {
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

  angular.module('BBAdmin.Controllers').controller('AdminLogin', ["$scope", "$rootScope", "$q", "$sessionStorage", "BBModel", function($scope, $rootScope, $q, $sessionStorage, BBModel) {
    $scope.login_data = {
      host: $sessionStorage.getItem('host'),
      email: null,
      password: null,
      selected_admin: null
    };
    $scope.login_template = 'login/admin_login.html';
    $scope.login = function() {
      var params;
      $scope.alert = "";
      params = {
        email: $scope.login_data.email,
        password: $scope.login_data.password
      };
      return BBModel.Admin.Login.$login(params).then(function(user) {
        if (user.company_id != null) {
          $scope.user = user;
          if ($scope.onSuccess) {
            return $scope.onSuccess();
          }
        } else {
          return user.$getAdministrators().then(function(administrators) {
            $scope.administrators = administrators;
            return $scope.pickCompany();
          });
        }
      }, function(err) {
        return $scope.alert = "Sorry, either your email or password was incorrect";
      });
    };
    $scope.pickCompany = function() {
      return $scope.login_template = 'login/admin_pick_company.html';
    };
    return $scope.selectedCompany = function() {
      var params;
      $scope.alert = "";
      params = {
        email: $scope.login_data.email,
        password: $scope.login_data.password
      };
      return $scope.login_data.selected_admin.$post('login', {}, params).then(function(login) {
        return $scope.login_data.selected_admin.$getCompany().then(function(company) {
          $scope.bb.company = company;
          BBModel.Admin.Login.$setLogin($scope.login_data.selected_admin);
          return $scope.onSuccess(company);
        });
      });
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('SelectedBookingDetails', ["$scope", "$location", "$rootScope", "BBModel", function($scope, $location, $rootScope, BBModel) {
    return $scope.$watch('selectedBooking', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue) {
          $scope.booking = newValue;
          return $scope.showItemView = "/view/dash/booking_details";
        }
      };
    })(this));
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('DashTimeList', ["$scope", "$rootScope", "$location", "$q", "$element", "AdminTimeService", function($scope, $rootScope, $location, $q, $element, AdminTimeService) {
    var $loaded;
    $loaded = null;
    $scope.init = (function(_this) {
      return function(day) {
        var elem, prms, timeListDef;
        $scope.selected_day = day;
        elem = angular.element($element);
        elem.attr('id', "tl_" + $scope.bb.company_id);
        angular.element($element).show();
        prms = {
          company_id: $scope.bb.company_id,
          day: day
        };
        if ($scope.service_id) {
          prms.service_id = $scope.service_id;
        }
        timeListDef = $q.defer();
        $scope.slots = timeListDef.promise;
        prms.url = $scope.bb.api_url;
        $scope.aslots = AdminTimeService.query(prms);
        return $scope.aslots.then(function(res) {
          var i, k, len, slot, slots, x, xres;
          $scope.loaded = true;
          slots = {};
          for (i = 0, len = res.length; i < len; i++) {
            x = res[i];
            if (!slots[x.time]) {
              slots[x.time] = x;
            }
          }
          xres = [];
          for (k in slots) {
            slot = slots[k];
            xres.push(slot);
          }
          return timeListDef.resolve(xres);
        });
      };
    })(this);
    if ($scope.selected_day) {
      $scope.init($scope.selected_day);
    }
    $scope.format_date = (function(_this) {
      return function(fmt) {
        return $scope.selected_date.format(fmt);
      };
    })(this);
    $scope.selectSlot = (function(_this) {
      return function(slot, route) {
        $scope.pickTime(slot.time);
        $scope.pickDate($scope.selected_date);
        return $location.path(route);
      };
    })(this);
    $scope.highlighSlot = (function(_this) {
      return function(slot) {
        $scope.pickTime(slot.time);
        $scope.pickDate($scope.selected_date);
        return $scope.setCheckout(true);
      };
    })(this);
    $scope.clear = (function(_this) {
      return function() {
        $scope.loaded = false;
        $scope.slots = null;
        return angular.element($element).hide();
      };
    })(this);
    return $scope.popupCheckout = (function(_this) {
      return function(slot) {
        var dHeight, dWidth, dlg, item, k, src, url, v, wHeight, wWidth;
        item = {
          time: slot.time,
          date: $scope.selected_day.date,
          company_id: $scope.bb.company_id,
          duration: 30,
          service_id: $scope.service_id,
          event_id: slot.id
        };
        url = "/booking/new_checkout?";
        for (k in item) {
          v = item[k];
          url += k + "=" + v + "&";
        }
        wWidth = $(window).width();
        dWidth = wWidth * 0.8;
        wHeight = $(window).height();
        dHeight = wHeight * 0.8;
        dlg = $("#dialog-modal");
        src = dlg.html("<iframe frameborder=0 id='mod_dlg' onload='nowait();setTimeout(set_iframe_focus, 100);' width=100% height=99% src='" + url + "'></iframe>");
        dlg.attr("title", "Checkout");
        return dlg.dialog({
          my: "top",
          at: "top",
          height: dHeight,
          width: dWidth,
          modal: true,
          overlay: {
            opacity: 0.1,
            background: "black"
          }
        });
      };
    })(this);
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('TimeOptions', ["$scope", "$location", "$rootScope", "BBModel", function($scope, $location, $rootScope, BBModel) {
    BBModel.Admin.Resource.$query({
      company: $scope.bb.company
    }).then(function(resources) {
      return $scope.resources = resources;
    });
    BBModel.Admin.Person.$query({
      company: $scope.bb.company
    }).then(function(people) {
      return $scope.people = people;
    });
    return $scope.block = function() {
      var params;
      if ($scope.person) {
        params = {
          start_time: $scope.start_time,
          end_time: $scope.end_time
        };
        BBModel.Admin.Person.$block($scope.bb.company, $scope.person, params);
      }
      return $scope.ok();
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Directives').directive('adminLogin', ["$uibModal", "$log", "$rootScope", "$q", "$document", "BBModel", function($uibModal, $log, $rootScope, $q, $document, BBModel) {
    var link, loginAdminController, pickCompanyController;
    loginAdminController = function($scope, $uibModalInstance, company_id) {
      $scope.title = 'Login';
      $scope.schema = {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            title: 'Email'
          },
          password: {
            type: 'string',
            title: 'Password'
          }
        }
      };
      $scope.form = [
        {
          key: 'email',
          type: 'email',
          feedback: false,
          autofocus: true
        }, {
          key: 'password',
          type: 'password',
          feedback: false
        }
      ];
      $scope.login_form = {};
      $scope.submit = function(form) {
        var options;
        options = {
          company_id: company_id
        };
        return BBModel.Admin.Login.$login(form, options).then(function(admin) {
          admin.email = form.email;
          admin.password = form.password;
          return $uibModalInstance.close(admin);
        }, function(err) {
          return $uibModalInstance.dismiss(err);
        });
      };
      return $scope.cancel = function() {
        return $uibModalInstance.dismiss('cancel');
      };
    };
    pickCompanyController = function($scope, $uibModalInstance, companies) {
      var c;
      $scope.title = 'Pick Company';
      $scope.schema = {
        type: 'object',
        properties: {
          company_id: {
            type: 'integer',
            title: 'Company'
          }
        }
      };
      $scope.schema.properties.company_id["enum"] = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = companies.length; i < len; i++) {
          c = companies[i];
          results.push(c.id);
        }
        return results;
      })();
      $scope.form = [
        {
          key: 'company_id',
          type: 'select',
          titleMap: (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = companies.length; i < len; i++) {
              c = companies[i];
              results.push({
                value: c.id,
                name: c.name
              });
            }
            return results;
          })(),
          autofocus: true
        }
      ];
      $scope.pick_company_form = {};
      $scope.submit = function(form) {
        return $uibModalInstance.close(form.company_id);
      };
      return $scope.cancel = function() {
        return $uibModalInstance.dismiss('cancel');
      };
    };
    link = function(scope, element, attrs) {
      var base, base1, loginModal, pickCompanyModal, tryLogin;
      $rootScope.bb || ($rootScope.bb = {});
      (base = $rootScope.bb).api_url || (base.api_url = scope.apiUrl);
      (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
      loginModal = function() {
        var modalInstance;
        modalInstance = $uibModal.open({
          templateUrl: 'login_modal_form.html',
          controller: loginAdminController,
          resolve: {
            company_id: function() {
              return scope.companyId;
            }
          }
        });
        return modalInstance.result.then(function(result) {
          scope.adminEmail = result.email;
          scope.adminPassword = result.password;
          if (result.$has('admins')) {
            return result.$get('admins').then(function(admins) {
              var m;
              scope.admins = admins;
              return $q.all((function() {
                var i, len, results;
                results = [];
                for (i = 0, len = admins.length; i < len; i++) {
                  m = admins[i];
                  results.push(m.$get('company'));
                }
                return results;
              })()).then(function(companies) {
                return pickCompanyModal(companies);
              });
            });
          } else {
            return scope.admin = result;
          }
        }, function() {
          return loginModal();
        });
      };
      pickCompanyModal = function(companies) {
        var modalInstance;
        modalInstance = $uibModal.open({
          templateUrl: 'pick_company_modal_form.html',
          controller: pickCompanyController,
          resolve: {
            companies: function() {
              return companies;
            }
          }
        });
        return modalInstance.result.then(function(company_id) {
          scope.companyId = company_id;
          return tryLogin();
        }, function() {
          return pickCompanyModal();
        });
      };
      tryLogin = function() {
        var login_form, options;
        login_form = {
          email: scope.adminEmail,
          password: scope.adminPassword
        };
        options = {
          company_id: scope.companyId
        };
        return BBModel.Admin.Login.$login(login_form, options).then(function(result) {
          if (result.$has('admins')) {
            return result.$get('admins').then(function(admins) {
              var a;
              scope.admins = admins;
              return $q.all((function() {
                var i, len, results;
                results = [];
                for (i = 0, len = admins.length; i < len; i++) {
                  a = admins[i];
                  results.push(a.$get('company'));
                }
                return results;
              })()).then(function(companies) {
                return pickCompanyModal(companies);
              });
            });
          } else {
            return scope.admin = result;
          }
        }, function(err) {
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
      template: "<div ng-hide='admin'><img src='/BB_wait.gif' class=\"loader\"></div>\n<div ng-show='admin' ng-transclude></div>"
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Directives').directive('bbAdminSsoLogin', ["$rootScope", "BBModel", "QueryStringService", "halClient", function($rootScope, BBModel, QueryStringService, halClient) {
    return {
      restrict: 'EA',
      scope: {
        token: '@bbAdminSsoLogin',
        companyId: '@',
        apiUrl: '@'
      },
      transclude: true,
      template: "<div ng-if='admin' ng-transclude></div>",
      link: function(scope, element, attrs) {
        var api_host, data, url;
        scope.qs = QueryStringService;
        data = {};
        if (scope.qs) {
          data.token = scope.qs('sso_token');
        }
        if (scope.token) {
          data.token || (data.token = scope.token);
        }
        if (scope.apiUrl) {
          api_host = scope.apiUrl;
        }
        api_host || (api_host = $rootScope.bb.api_url);
        url = api_host + "/api/v1/login/admin_sso/" + scope.companyId;
        return halClient.$post(url, {}, data).then(function(login) {
          var params;
          params = {
            auth_token: login.auth_token
          };
          return login.$get('administrator', params).then(function(admin) {
            scope.admin = admin;
            return BBModel.Admin.Login.$setLogin(admin);
          });
        });
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin').directive('bookingTable', ["BBModel", "ModalForm", function(BBModel, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'datetime'];
      $scope.getBookings = function() {
        var params;
        params = {
          company: $scope.company
        };
        return BBModel.Admin.Booking.$query(params).then(function(bookings) {
          return $scope.bookings = bookings.items;
        });
      };
      $scope.newBooking = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Booking',
          new_rel: 'new_booking',
          post_rel: 'bookings',
          success: function(booking) {
            return $scope.bookings.push(booking);
          }
        });
      };
      return $scope.edit = function(booking) {
        return ModalForm.edit({
          model: booking,
          title: 'Edit Booking'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getBookings();
      } else {
        return BBModel.Admin.Company.$query(attrs).then(function(company) {
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
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Directives').directive('bbPeopleList', ["$rootScope", function($rootScope) {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: ["$scope", "$rootScope", "PersonService", "$q", "BBModel", "PersonModel", function($scope, $rootScope, PersonService, $q, BBModel, PersonModel) {
        $rootScope.connection_started.then(function() {
          return $scope.bb.company.$getPeople().then(function(people) {
            var i, len, person, results;
            $scope.people = people;
            results = [];
            for (i = 0, len = people.length; i < len; i++) {
              person = people[i];
              results.push(person.show = true);
            }
            return results;
          });
        });
        $scope.show_all_people = function() {
          var i, len, ref, results, x;
          ref = $scope.people;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            results.push(x.show = true);
          }
          return results;
        };
        return $scope.hide_all_people = function() {
          var i, len, ref, results, x;
          ref = $scope.people;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            results.push(x.show = false);
          }
          return results;
        };
      }],
      link: function(scope, element, attrs) {}
    };
  }]);

  angular.module('BBAdmin.Directives').directive('bbBookingList', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        bookings: '=',
        cancelled: '=',
        params: '='
      },
      templateUrl: function(tElm, tAttrs) {
        return tAttrs.template;
      },
      controller: ["$scope", "$filter", function($scope, $filter) {
        var status;
        $scope.title = $scope.params.title;
        status = $scope.params.status;
        return $scope.$watch(function() {
          return $scope.bookings;
        }, function() {
          var bookings, cancelled;
          bookings = $scope.bookings;
          cancelled = $scope.cancelled;
          if (cancelled == null) {
            cancelled = false;
          }
          if ((bookings != null)) {
            bookings = $filter('filter')(bookings, function(booking) {
              var ret;
              ret = booking.is_cancelled === cancelled;
              if ((status != null)) {
                ret &= booking.hasStatus(status);
              } else {
                ret &= (booking.multi_status == null) || Object.keys(booking.multi_status).length === 0;
              }
              ret &= booking.status === 4;
              return ret;
            });
            $scope.relevantBookings = $filter('orderBy')(bookings, 'datetime');
          }
          return $scope.relevantBookings != null ? $scope.relevantBookings : $scope.relevantBookings = [];
        });
      }]
    };
  });

}).call(this);

(function() {
  'use strict';
  var bbAdminFilters;

  bbAdminFilters = angular.module('BBAdmin.Filters', []);

  bbAdminFilters.filter('rag', function() {
    return function(value, v1, v2) {
      if (value <= v1) {
        return "red";
      } else if (value <= v2) {
        return "amber";
      } else {
        return "green";
      }
    };
  });

  bbAdminFilters.filter('gar', function() {
    return function(value, v1, v2) {
      if (value <= v1) {
        return "green";
      } else if (value <= v2) {
        return "amber";
      } else {
        return "red";
      }
    };
  });

  bbAdminFilters.filter('time', ["$window", function($window) {
    return function(v) {
      return $window.sprintf("%02d:%02d", Math.floor(v / 60), v % 60);
    };
  }]);

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminAdministratorModel", ["$q", "BBModel", "BaseModel", function($q, BBModel, BaseModel) {
    var Administrator;
    return Administrator = (function(superClass) {
      extend(Administrator, superClass);

      function Administrator() {
        return Administrator.__super__.constructor.apply(this, arguments);
      }

      return Administrator;

    })(BaseModel);
  }]);

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminBookingModel", ["$q", "BBModel", "BaseModel", "BookingCollections", "$window", function($q, BBModel, BaseModel, BookingCollections, $window) {
    var Admin_Booking;
    return Admin_Booking = (function(superClass) {
      extend(Admin_Booking, superClass);

      function Admin_Booking(data) {
        var k, ref, v;
        Admin_Booking.__super__.constructor.apply(this, arguments);
        this.datetime = moment(this.datetime);
        this.start = this.datetime;
        this.end = this.end_datetime;
        this.end || (this.end = this.datetime.clone().add(this.duration, 'minutes'));
        this.title = this.full_describe;
        this.time = this.start.hour() * 60 + this.start.minute();
        this.allDay = false;
        if (this.duration_span && this.duration_span === 86400) {
          this.allDay = true;
        }
        if (this.status === 3) {
          this.startEditable = true;
          this.durationEditable = true;
          this.className = "status_blocked";
        } else if (this.status === 4) {
          this.className = "status_booked";
        } else if (this.status === 0) {
          this.className = "status_available";
        }
        if (this.multi_status) {
          ref = this.multi_status;
          for (k in ref) {
            v = ref[k];
            this.className += " status_" + k;
          }
        }
      }

      Admin_Booking.prototype.useFullTime = function() {
        this.using_full_time = true;
        if (this.pre_time) {
          this.start = this.datetime.clone().subtract(this.pre_time, 'minutes');
        }
        if (this.post_time) {
          return this.end = this.datetime.clone().add(this.duration + this.post_time, 'minutes');
        }
      };

      Admin_Booking.prototype.getPostData = function() {
        var data, q;
        data = {};
        if (this.date && this.time) {
          data.date = this.date.date.toISODate();
          data.time = this.time.time;
          if (this.time.event_id) {
            data.event_id = this.time.event_id;
          } else if (this.time.event_ids) {
            data.event_ids = this.time.event_ids;
          }
        } else {
          this.datetime = this.start.clone();
          if (this.using_full_time) {
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
          data.questions = (function() {
            var i, len, ref, results;
            ref = this.questions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              q = ref[i];
              results.push(q.getPostData());
            }
            return results;
          }).call(this);
        }
        return data;
      };

      Admin_Booking.prototype.hasStatus = function(status) {
        return this.multi_status[status] != null;
      };

      Admin_Booking.prototype.statusTime = function(status) {
        if (this.multi_status[status]) {
          return moment(this.multi_status[status]);
        } else {
          return null;
        }
      };

      Admin_Booking.prototype.sinceStatus = function(status) {
        var s;
        s = this.statusTime(status);
        if (!s) {
          return 0;
        }
        return Math.floor((moment().unix() - s.unix()) / 60);
      };

      Admin_Booking.prototype.sinceStart = function(options) {
        var s, start;
        start = this.datetime.unix();
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

      Admin_Booking.prototype.answer = function(q) {
        var a, i, len, ref;
        if (this.answers_summary) {
          ref = this.answers_summary;
          for (i = 0, len = ref.length; i < len; i++) {
            a = ref[i];
            if (a.name === q) {
              return a.answer;
            }
          }
        }
        return null;
      };

      Admin_Booking.prototype.$update = function(data) {
        var defer;
        defer = $q.defer();
        if (data) {
          data.datetime = moment(data.datetime);
          data.datetime.tz();
          data.datetime = data.datetime.format();
        }
        data || (data = this.getPostData());
        this.$put('self', {}, data).then((function(_this) {
          return function(res) {
            _this.constructor(res);
            if (_this.using_full_time) {
              _this.useFullTime();
            }
            BookingCollections.checkItems(_this);
            return defer.resolve(_this);
          };
        })(this), function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      };

      Admin_Booking.prototype.$refetch = function() {
        var defer;
        defer = $q.defer();
        this.$flush('self');
        this.$get('self').then((function(_this) {
          return function(res) {
            _this.constructor(res);
            if (_this.using_full_time) {
              _this.useFullTime();
            }
            BookingCollections.checkItems(_this);
            return defer.resolve(_this);
          };
        })(this), function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      };

      Admin_Booking.$query = function(params) {
        var company, defer, existing, src;
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
        defer = $q.defer();
        existing = BookingCollections.find(params);
        if (existing && !params.skip_cache) {
          defer.resolve(existing);
        } else {
          src = company;
          src || (src = params.src);
          if (params.src) {
            delete params.src;
          }
          if (params.skip_cache) {
            if (existing) {
              BookingCollections["delete"](existing);
            }
            src.$flush('bookings', params);
          }
          src.$get('bookings', params).then(function(resource) {
            var booking;
            if (resource.$has('bookings')) {
              return resource.$get('bookings').then(function(bookings) {
                var b, models, spaces;
                models = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = bookings.length; i < len; i++) {
                    b = bookings[i];
                    results.push(new BBModel.Admin.Booking(b));
                  }
                  return results;
                })();
                spaces = new $window.Collection.Booking(resource, models, params);
                BookingCollections.add(spaces);
                return defer.resolve(spaces);
              }, function(err) {
                return defer.reject(err);
              });
            } else {
              booking = new BBModel.Admin.Booking(resource);
              return defer.resolve(booking);
            }
          }, function(err) {
            return defer.reject(err);
          });
        }
        return defer.promise;
      };

      return Admin_Booking;

    })(BaseModel);
  }]);

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminClientModel", ["ClientModel", "$q", "BBModel", "$log", "$window", "ClientCollections", "$rootScope", "UriTemplate", "halClient", function(ClientModel, $q, BBModel, $log, $window, ClientCollections, $rootScope, UriTemplate, halClient) {
    var Admin_Client;
    return Admin_Client = (function(superClass) {
      extend(Admin_Client, superClass);

      function Admin_Client(data) {
        Admin_Client.__super__.constructor.call(this, data);
      }

      Admin_Client.$query = function(params) {
        var company, defer, href, uri, url;
        company = params.company;
        defer = $q.defer();
        if (company.$has('client')) {
          url = "";
          if ($rootScope.bb.api_url) {
            url = $rootScope.bb.api_url;
          }
          href = url + "/api/v1/admin/{company_id}/client{/id}{?page,per_page,filter_by,filter_by_fields,order_by,order_by_reverse,search_by_fields,default_company_id}";
          params.company_id = company.id;
          uri = new UriTemplate(href).fillFromObject(params || {});
          if (params.flush) {
            halClient.clearCache(uri);
          }
          halClient.$get(uri, {}).then((function(_this) {
            return function(resource) {
              var client;
              if (resource.$has('clients')) {
                return resource.$get('clients').then(function(clients) {
                  var c, models;
                  models = (function() {
                    var i, len, results;
                    results = [];
                    for (i = 0, len = clients.length; i < len; i++) {
                      c = clients[i];
                      results.push(new BBModel.Admin.Client(c));
                    }
                    return results;
                  })();
                  clients = new $window.Collection.Client(resource, models, params);
                  clients.total_entries = resource.total_entries;
                  ClientCollections.add(clients);
                  return defer.resolve(clients);
                }, function(err) {
                  return defer.reject(err);
                });
              } else {
                client = new BBModel.Admin.Client(resource);
                return defer.resolve(client);
              }
            };
          })(this), function(err) {
            return defer.reject(err);
          });
        } else {
          $log.warn('company has no client link');
          defer.reject('company has no client link');
        }
        return defer.promise;
      };

      return Admin_Client;

    })(ClientModel);
  }]);

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminCompanyModel", ["CompanyModel", "AdminCompanyService", "BookingCollections", "$q", "BBModel", function(CompanyModel, AdminCompanyService, BookingCollections, $q, BBModel) {
    var Admin_Company;
    return Admin_Company = (function(superClass) {
      extend(Admin_Company, superClass);

      function Admin_Company(data) {
        Admin_Company.__super__.constructor.call(this, data);
      }

      Admin_Company.prototype.getBooking = function(id) {
        var defer;
        defer = $q.defer();
        this.$get('bookings', {
          id: id
        }).then(function(booking) {
          var model;
          model = new BBModel.Admin.Booking(booking);
          BookingCollections.checkItems(model);
          return defer.resolve(model);
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      };

      Admin_Company.$query = function(params) {
        return AdminCompanyService.query(params);
      };

      return Admin_Company;

    })(CompanyModel);
  }]);

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminLoginModel", ["$q", "AdminLoginService", "BBModel", "BaseModel", function($q, AdminLoginService, BBModel, BaseModel) {
    var Admin_Login;
    return Admin_Login = (function(superClass) {
      extend(Admin_Login, superClass);

      function Admin_Login(data) {
        Admin_Login.__super__.constructor.call(this, data);
      }

      Admin_Login.$login = function(form, options) {
        return AdminLoginService.login(form, options);
      };

      Admin_Login.$ssoLogin = function(options, data) {
        return AdminLoginService.ssoLogin(options, data);
      };

      Admin_Login.$isLoggedIn = function() {
        return AdminLoginService.isLoggedIn();
      };

      Admin_Login.$setLogin = function(user) {
        return AdminLoginService.setLogin(user);
      };

      Admin_Login.$user = function() {
        return AdminLoginService.user();
      };

      Admin_Login.$checkLogin = function(params) {
        return AdminLoginService.checkLogin(params);
      };

      Admin_Login.$logout = function() {
        return AdminLoginService.logout();
      };

      Admin_Login.$getLogin = function(options) {
        return AdminLoginService.getLogin(options);
      };

      Admin_Login.$companyLogin = function(company, params) {
        return AdminLoginService.companyLogin(company, params);
      };

      Admin_Login.$memberQuery = function(params) {
        return AdminLoginService.memberQuery(params);
      };

      Admin_Login.$setCompany = function(company_id) {
        return AdminLoginService.setCompany(company_id);
      };

      return Admin_Login;

    })(BaseModel);
  }]);

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminSlotModel", ["$q", "BBModel", "BaseModel", "TimeSlotModel", "SlotCollections", "$window", function($q, BBModel, BaseModel, TimeSlotModel, SlotCollections, $window) {
    var Admin_Slot;
    return Admin_Slot = (function(superClass) {
      extend(Admin_Slot, superClass);

      function Admin_Slot(data) {
        var k, ref, v;
        Admin_Slot.__super__.constructor.call(this, data);
        this.title = this.full_describe;
        if (this.status === 0) {
          this.title = "Available";
        }
        this.datetime = moment(this.datetime);
        this.start = this.datetime;
        this.end = this.end_datetime;
        this.end = this.datetime.clone().add(this.duration, 'minutes');
        this.time = this.start.hour() * 60 + this.start.minute();
        this.title = this.full_describe;
        this.allDay = false;
        if (this.duration_span && this.duration_span === 86400) {
          this.allDay = true;
        }
        if (this.status === 3) {
          this.startEditable = true;
          this.durationEditable = true;
          this.className = "status_blocked";
        } else if (this.status === 4) {
          this.className = "status_booked";
        } else if (this.status === 0) {
          this.className = "status_available";
        }
        if (this.multi_status) {
          ref = this.multi_status;
          for (k in ref) {
            v = ref[k];
            this.className += " status_" + k;
          }
        }
      }

      Admin_Slot.prototype.useFullTime = function() {
        this.using_full_time = true;
        if (this.pre_time) {
          this.start = this.datetime.clone().subtract(this.pre_time, 'minutes');
        }
        if (this.post_time) {
          return this.end = this.datetime.clone().add(this.duration + this.post_time, 'minutes');
        }
      };

      Admin_Slot.prototype.$refetch = function() {
        var defer;
        defer = $q.defer();
        this.$flush('self');
        this.$get('self').then((function(_this) {
          return function(res) {
            _this.constructor(res);
            if (_this.using_full_time) {
              _this.useFullTime();
            }
            BookingCollections.checkItems(_this);
            return defer.resolve(_this);
          };
        })(this), function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      };

      Admin_Slot.$query = function(params) {
        var company, defer, existing, src;
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
        defer = $q.defer();
        existing = SlotCollections.find(params);
        if (existing && !params.skip_cache) {
          defer.resolve(existing);
        } else {
          src = company;
          src || (src = params.src);
          if (params.src) {
            delete params.src;
          }
          if (params.skip_cache) {
            if (existing) {
              SlotCollections["delete"](existing);
            }
            src.$flush('slots', params);
          }
          src.$get('slots', params).then(function(resource) {
            var slot;
            if (resource.$has('slots')) {
              return resource.$get('slots').then(function(slots) {
                var b, models, spaces;
                models = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = slots.length; i < len; i++) {
                    b = slots[i];
                    results.push(new BBModel.Admin.Slot(b));
                  }
                  return results;
                })();
                spaces = new $window.Collection.Slot(resource, models, params);
                SlotCollections.add(spaces);
                return defer.resolve(spaces);
              }, function(err) {
                return defer.reject(err);
              });
            } else {
              slot = new BBModel.Admin.Slot(resource);
              return defer.resolve(slot);
            }
          }, function(err) {
            return defer.reject(err);
          });
        }
        return defer.promise;
      };

      return Admin_Slot;

    })(TimeSlotModel);
  }]);

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminUserModel", ["$q", "BBModel", "BaseModel", function($q, BBModel, BaseModel) {
    var User;
    return User = (function(superClass) {
      extend(User, superClass);

      function User() {
        return User.__super__.constructor.apply(this, arguments);
      }

      return User;

    })(BaseModel);
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminBookingService', ["$q", "$window", "halClient", "BookingCollections", "BBModel", "UriTemplate", function($q, $window, halClient, BookingCollections, BBModel, UriTemplate) {
    return {
      query: function(prms) {
        var company, deferred, existing, href, uri, url;
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
        deferred = $q.defer();
        existing = BookingCollections.find(prms);
        if (existing && !prms.skip_cache) {
          deferred.resolve(existing);
        } else if (company) {
          if (prms.skip_cache) {
            if (existing) {
              BookingCollections["delete"](existing);
            }
            company.$flush('bookings', prms);
          }
          company.$get('bookings', prms).then(function(collection) {
            return collection.$get('bookings').then(function(bookings) {
              var b, models, spaces;
              models = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = bookings.length; i < len; i++) {
                  b = bookings[i];
                  results.push(new BBModel.Admin.Booking(b));
                }
                return results;
              })();
              spaces = new $window.Collection.Booking(collection, models, prms);
              BookingCollections.add(spaces);
              return deferred.resolve(spaces);
            }, function(err) {
              return deferred.reject(err);
            });
          }, function(err) {
            return deferred.reject(err);
          });
        } else {
          url = "";
          if (prms.url) {
            url = prms.url;
          }
          href = url + "/api/v1/admin/{company_id}/bookings{?slot_id,start_date,end_date,service_id,resource_id,person_id,page,per_page,include_cancelled,embed,client_id}";
          uri = new UriTemplate(href).fillFromObject(prms || {});
          halClient.$get(uri, {}).then((function(_this) {
            return function(found) {
              return found.$get('bookings').then(function(items) {
                var i, item, len, sitems, spaces;
                sitems = [];
                for (i = 0, len = items.length; i < len; i++) {
                  item = items[i];
                  sitems.push(new BBModel.Admin.Booking(item));
                }
                spaces = new $window.Collection.Booking(found, sitems, prms);
                BookingCollections.add(spaces);
                return deferred.resolve(spaces);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      },
      getBooking: function(prms) {
        var deferred, href, uri, url;
        deferred = $q.defer();
        if (prms.company && !prms.company_id) {
          prms.company_id = prms.company.id;
        }
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/admin/{company_id}/bookings/{id}{?embed}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$get(uri, {
          no_cache: true
        }).then(function(item) {
          var booking;
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      cancelBooking: function(prms, booking) {
        var deferred, href, notify, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{id}?notify={notify}";
        if (prms.id == null) {
          prms.id = booking.id;
        }
        notify = prms.notify;
        if (notify == null) {
          notify = true;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$del(uri, {
          notify: notify
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      updateBooking: function(prms, booking) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{id}";
        if (prms.id == null) {
          prms.id = booking.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, prms).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      blockTimeForPerson: function(prms, person) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/people/{person_id}/block";
        if (prms.person_id == null) {
          prms.person_id = person.id;
        }
        prms.booking = true;
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, prms).then(function(item) {
          var booking;
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      addStatusToBooking: function(prms, booking, status) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/multi_status";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, {
          status: status
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      addPrivateNoteToBooking: function(prms, booking, note) {
        var deferred, href, noteParam, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        if (note.note != null) {
          noteParam = note.note;
        }
        if (noteParam == null) {
          noteParam = note;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, {
          note: noteParam
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      updatePrivateNoteForBooking: function(prms, booking, note) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes/{id}";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        if (prms.id == null) {
          prms.id = note.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, {
          note: note.note
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      deletePrivateNoteFromBooking: function(prms, booking, note) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes/{id}";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        if (prms.id == null) {
          prms.id = note.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$del(uri, {}).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('ColorPalette', function() {
    var colors;
    colors = [
      {
        primary: '#001F3F',
        secondary: '#80BFFF'
      }, {
        primary: '#FF4136',
        secondary: '#800600'
      }, {
        primary: '#7FDBFF',
        secondary: '#004966'
      }, {
        primary: '#3D9970',
        secondary: '#163728'
      }, {
        primary: '#85144B',
        secondary: '#EB7AB1'
      }, {
        primary: '#2ECC40',
        secondary: '#0E3E14'
      }, {
        primary: '#FF851B',
        secondary: '#663000'
      }
    ];
    return {
      setColors: function(models) {
        return _.each(models, function(model, i) {
          var color;
          color = colors[i % colors.length];
          model.color = color.primary;
          return model.textColor = color.secondary;
        });
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminCompanyService', ["$q", "$rootScope", "$sessionStorage", "BBModel", function($q, $rootScope, $sessionStorage, BBModel) {
    return {
      query: function(params) {
        var base, base1, base2, defer;
        defer = $q.defer();
        $rootScope.bb || ($rootScope.bb = {});
        (base = $rootScope.bb).api_url || (base.api_url = $sessionStorage.getItem("host"));
        (base1 = $rootScope.bb).api_url || (base1.api_url = params.apiUrl);
        (base2 = $rootScope.bb).api_url || (base2.api_url = "");
        BBModel.Admin.Login.$checkLogin(params).then(function() {
          var login_form, options;
          if ($rootScope.user && $rootScope.user.company_id) {
            $rootScope.bb || ($rootScope.bb = {});
            $rootScope.bb.company_id = $rootScope.user.company_id;
            return $rootScope.user.$get('company').then(function(company) {
              return defer.resolve(new BBModel.Admin.Company(company));
            }, function(err) {
              return defer.reject(err);
            });
          } else {
            login_form = {
              email: params.adminEmail,
              password: params.adminPassword
            };
            options = {
              company_id: params.companyId
            };
            return BBModel.Admin.Login.$login(login_form, options).then(function(user) {
              return user.$get('company').then(function(company) {
                return defer.resolve(new BBModel.Admin.Company(company));
              }, function(err) {
                return defer.reject(err);
              });
            }, function(err) {
              return defer.reject(err);
            });
          }
        });
        return defer.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminDayService', ["$q", "$window", "halClient", "BBModel", "UriTemplate", function($q, $window, halClient, BBModel, UriTemplate) {
    return {
      query: function(prms) {
        var deferred, href, uri, url;
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/{company_id}/day_data{?month,week,date,edate,event_id,service_id}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {}).then((function(_this) {
          return function(found) {
            var item, j, len, mdays, ref;
            if (found.items) {
              mdays = [];
              ref = found.items;
              for (j = 0, len = ref.length; j < len; j++) {
                item = ref[j];
                halClient.$get(item.uri).then(function(data) {
                  var days, dcol, i, k, len1, ref1;
                  days = [];
                  ref1 = data.days;
                  for (k = 0, len1 = ref1.length; k < len1; k++) {
                    i = ref1[k];
                    if (i.type === prms.item) {
                      days.push(new BBModel.Day(i));
                    }
                  }
                  dcol = new $window.Collection.Day(data, days, {});
                  return mdays.push(dcol);
                });
              }
              return deferred.resolve(mdays);
            }
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory("AdminLoginService", ["$q", "halClient", "$rootScope", "BBModel", "$sessionStorage", "$cookies", "UriTemplate", "shared_header", function($q, halClient, $rootScope, BBModel, $sessionStorage, $cookies, UriTemplate, shared_header) {
    return {
      login: function(form, options) {
        var deferred, url;
        deferred = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/admin";
        if ((options != null) && (options.company_id != null)) {
          url = url + "/" + options.company_id;
        }
        halClient.$post(url, options, form).then((function(_this) {
          return function(login) {
            var login_model;
            if (login.$has('administrator')) {
              return login.$get('administrator').then(function(user) {
                user = _this.setLogin(user);
                return deferred.resolve(user);
              });
            } else if (login.$has('administrators')) {
              login_model = new BBModel.Admin.Login(login);
              return deferred.resolve(login_model);
            } else {
              return deferred.reject("No admin account for login");
            }
          };
        })(this), (function(_this) {
          return function(err) {
            var login, login_model;
            if (err.status === 400) {
              login = halClient.$parse(err.data);
              if (login.$has('administrators')) {
                login_model = new BBModel.Admin.Login(login);
                return deferred.resolve(login_model);
              } else {
                return deferred.reject(err);
              }
            } else {
              return deferred.reject(err);
            }
          };
        })(this));
        return deferred.promise;
      },
      ssoLogin: function(options, data) {
        var deferred, url;
        deferred = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/sso/" + options['company_id'];
        halClient.$post(url, {}, data).then((function(_this) {
          return function(login) {
            var params;
            params = {
              auth_token: login.auth_token
            };
            return login.$get('user').then(function(user) {
              user = _this.setLogin(user);
              return deferred.resolve(user);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      isLoggedIn: function() {
        var deferred;
        deferred = $q.defer();
        this.checkLogin().then(function() {
          if ($rootScope.user) {
            return deferred.resolve(true);
          } else {
            return deferred.reject(false);
          }
        }, function(err) {
          return deferred.reject(false);
        });
        return deferred.promise;
      },
      setLogin: function(user) {
        var auth_token;
        user = new BBModel.Admin.User(user);
        auth_token = user.getOption('auth_token');
        $sessionStorage.setItem("user", user.$toStore());
        $sessionStorage.setItem("auth_token", auth_token);
        $rootScope.user = user;
        return user;
      },
      user: function() {
        return this.checkLogin().then(function() {
          return $rootScope.user;
        });
      },
      checkLogin: function(params) {
        var auth_token, defer, href, options, url, user;
        if (params == null) {
          params = {};
        }
        defer = $q.defer();
        if ($rootScope.user) {
          defer.resolve();
        }
        user = $sessionStorage.getItem("user");
        if (user) {
          $rootScope.user = new BBModel.Admin.User(halClient.createResource(user));
          defer.resolve();
        } else {
          auth_token = $cookies.get('Auth-Token');
          if (auth_token) {
            if ($rootScope.bb.api_url) {
              url = $rootScope.bb.api_url + "/api/v1/login{?id,role}";
            } else {
              url = "/api/v1/login{?id,role}";
            }
            params.id = params.companyId || params.company_id;
            params.role = 'admin';
            href = new UriTemplate(url).fillFromObject(params || {});
            options = {
              auth_token: auth_token
            };
            halClient.$get(href, options).then((function(_this) {
              return function(login) {
                if (login.$has('administrator')) {
                  return login.$get('administrator').then(function(user) {
                    $rootScope.user = new BBModel.Admin.User(user);
                    return defer.resolve();
                  });
                } else {
                  return defer.resolve();
                }
              };
            })(this), function() {
              return defer.resolve();
            });
          } else {
            defer.resolve();
          }
        }
        return defer.promise;
      },
      logout: function() {
        var defer, url;
        defer = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login";
        halClient.$del(url)["finally"](function() {
          $rootScope.user = null;
          $sessionStorage.removeItem("user");
          $sessionStorage.removeItem("auth_token");
          $cookies.remove('Auth-Token');
          shared_header.del('auth_token');
          return defer.resolve();
        }, function() {
          return defer.reject();
        });
        return defer.promise;
      },
      getLogin: function(options) {
        var defer, url;
        defer = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/admin/" + options.company_id;
        halClient.$get(url, options).then((function(_this) {
          return function(login) {
            if (login.$has('administrator')) {
              return login.$get('administrator').then(function(user) {
                user = _this.setLogin(user);
                return defer.resolve(user);
              }, function(err) {
                return defer.reject(err);
              });
            } else {
              return defer.reject();
            }
          };
        })(this), function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      },
      setCompany: function(company_id) {
        var defer, params, url;
        defer = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/admin";
        params = {
          company_id: company_id
        };
        halClient.$put(url, {}, params).then((function(_this) {
          return function(login) {
            if (login.$has('administrator')) {
              return login.$get('administrator').then(function(user) {
                user = _this.setLogin(user);
                return defer.resolve(user);
              }, function(err) {
                return defer.reject(err);
              });
            } else {
              return defer.reject();
            }
          };
        })(this), function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminPurchaseService', ["$q", "halClient", "BBModel", function($q, halClient, BBModel) {
    return {
      query: function(params) {
        var defer, uri;
        defer = $q.defer();
        uri = params.url_root + "/api/v1/admin/purchases/" + params.purchase_id;
        halClient.$get(uri, params).then(function(purchase) {
          purchase = new BBModel.Purchase.Total(purchase);
          return defer.resolve(purchase);
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      },
      markAsPaid: function(params) {
        var company_id, data, defer, uri;
        defer = $q.defer();
        if (!params.purchase || !params.url_root) {
          defer.reject("invalid request");
          return defer.promise;
        }
        if (params.company) {
          company_id = params.company.id;
        }
        uri = params.url_root + ("/api/v1/admin/" + company_id + "/purchases/" + params.purchase.id + "/pay");
        data = {};
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
        halClient.$put(uri, params, data).then(function(purchase) {
          purchase = new BBModel.Purchase.Total(purchase);
          return defer.resolve(purchase);
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminSlotService', ["$q", "$window", "halClient", "SlotCollections", "BBModel", "UriTemplate", function($q, $window, halClient, SlotCollections, BBModel, UriTemplate) {
    return {
      query: function(prms) {
        var deferred, existing, href, uri, url;
        deferred = $q.defer();
        existing = SlotCollections.find(prms);
        if (existing) {
          deferred.resolve(existing);
        } else if (prms.user) {
          prms.user.$get('company').then(function(company) {
            return company.$get('slots', prms).then(function(slots_collection) {
              return slots_collection.$get('slots').then(function(slots) {
                var s, slot_models;
                slot_models = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = slots.length; i < len; i++) {
                    s = slots[i];
                    results.push(new BBModel.Admin.Slot(s));
                  }
                  return results;
                })();
                return deferred.resolve(slot_models);
              }, function(err) {
                return deferred.reject(err);
              });
            });
          });
        } else {
          url = "";
          if (prms.url) {
            url = prms.url;
          }
          href = url + "/api/v1/admin/{company_id}/slots{?start_date,end_date,date,service_id,resource_id,person_id,page,per_page}";
          uri = new UriTemplate(href).fillFromObject(prms || {});
          halClient.$get(uri, {}).then((function(_this) {
            return function(found) {
              return found.$get('slots').then(function(items) {
                var i, item, len, sitems, slots;
                sitems = [];
                for (i = 0, len = items.length; i < len; i++) {
                  item = items[i];
                  sitems.push(new BBModel.Admin.Slot(item));
                }
                slots = new $window.Collection.Slot(found, sitems, prms);
                SlotCollections.add(slots);
                return deferred.resolve(slots);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      },
      create: function(prms, data) {
        var deferred, href, uri, url;
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/admin/{company_id}/slots";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$post(uri, {}, data).then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      "delete": function(item) {
        var deferred;
        deferred = $q.defer();
        item.$del('self').then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.deleteItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      update: function(item, data) {
        var deferred;
        deferred = $q.defer();
        item.$put('self', {}, data).then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminTimeService', ["$q", "$window", "halClient", "BBModel", "UriTemplate", function($q, $window, halClient, BBModel, UriTemplate) {
    return {
      query: function(prms) {
        var deferred, href, uri, url;
        if (prms.day) {
          prms.date = prms.day.date;
        }
        if (!prms.edate && prms.date) {
          prms.edate = prms.date;
        }
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/{company_id}/time_data{?date,event_id,service_id,person_id}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {
          no_cache: false
        }).then((function(_this) {
          return function(found) {
            return found.$get('events').then(function(events) {
              var event, eventItem, eventItems, i, j, len, len1, ref, time, ts;
              eventItems = [];
              for (i = 0, len = events.length; i < len; i++) {
                eventItem = events[i];
                event = {};
                event.times = [];
                event.event_id = eventItem.event_id;
                event.person_id = found.person_id;
                ref = eventItem.times;
                for (j = 0, len1 = ref.length; j < len1; j++) {
                  time = ref[j];
                  ts = new BBModel.TimeSlot(time);
                  event.times.push(ts);
                }
                eventItems.push(event);
              }
              return deferred.resolve(eventItems);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BB.Services').factory("BB.Service.login", ["$q", "BBModel", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Admin.Login(resource);
      }
    };
  }]);

  angular.module('BB.Services').factory("BB.Service.base_login", ["$q", "BBModel", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Admin.Login(resource);
      }
    };
  }]);

}).call(this);

(function() {
  "use strict";
  angular.module("BBAdmin").config(["$translateProvider", function($translateProvider) {
    "ngInject";
    var translations;
    translations = {
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
  }]);

}).call(this);
