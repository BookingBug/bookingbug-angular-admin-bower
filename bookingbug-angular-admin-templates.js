angular.module("BB").run(["$templateCache", function($templateCache) {$templateCache.put("booking_table_main.html","<button class=\"btn btn-default\" ng-click=\"newBooking()\">New Booking</button>\r\n<table tr-ng-grid=\"\" items=\"bookings\" fields=\"fields\" ng-if=\"bookings\">\r\n	<tbody>\r\n		<tr>\r\n			<td>\r\n				<button class=\"btn btn-default btn-sm\" ng-click=\"edit(gridItem)\">Edit</button>\r\n			</td>\r\n		</tr>\r\n	</tbody>\r\n</table>\r\n");
$templateCache.put("admin_login.html","<div>\r\n  <form name=\"login_form\" ng-submit=\"login()\" class=\"form-horizontal\"\r\n  role=\"form\">\r\n    <div class=\"alert alert-danger\" role=\"alert\" ng-if=\"alert && alert.length > 0\">{{alert}}</div>\r\n\r\n    <div ng-class=\"{\'form-group\': true, \'has-error\': emailIsInvalid()}\">\r\n      <label for=\"email\" class=\"col-sm-2 control-label\">Email</label>\r\n      <div class=\"col-sm-10\">\r\n        <input type=\"email\" ng-model=\"login.email\" name=\"email\" class=\"form-control\"\r\n          id=\"email\" placeholder=\"Email\" required autofocus>\r\n      </div>\r\n    </div>\r\n\r\n    <div ng-class=\"{\'form-group\': true, \'has-error\': passwordIsInvalid()}\">\r\n      <label for=\"password\" class=\"col-sm-2 control-label\">Password</label>\r\n      <div class=\"col-sm-10\">\r\n        <input type=\"password\" ng-model=\"login.password\" name=\"password\"\r\n          class=\"form-control\" id=\"password\" placeholder=\"Password\" required>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\">\r\n      <div class=\"col-sm-offset-2 col-sm-10\">\r\n        <button type=\"submit\" class=\"btn btn-primary\">Log In</button>\r\n      </div>\r\n    </div>\r\n  </form>\r\n</div>\r\n");
$templateCache.put("pick_company.html","<form name=\"pick_company_form\" ng-submit=\"selectedCompany()\" role=\"form\">\r\n  <p>Pick Company</p>\r\n  <div ng-repeat=\"admin in administrators\" class=\"radio\">\r\n    <label>\r\n      <input id=\"company{{admin.company_id}}\" type=\"radio\"\r\n        ng-model=\"$parent.selected_admin\" ng-value=\"admin\" required\r\n        name=\"company\">\r\n      {{admin.company_name}}\r\n    </label>\r\n  </div>\r\n  <input type=\"submit\" class=\"btn btn-default\">\r\n</form>\r\n");}]);