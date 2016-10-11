(function () {
    'use strict';
    angular.module('app').factory('authService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {

        var serviceBase = '/';
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            username: "",
            token: "",
            household: '',
            userid: ''
        };

        

        authServiceFactory.user = {};


        var _register = function (registration) {

            _logOut();

            return $http.post('/api/account/register', registration).then(function (response) {
                return response;
            });

        };

        var _login = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

            var deferred = $q.defer();

            $http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                var username = response.userName;

                _authentication.isAuth = true;
                _authentication.username = response.userName;
                _authentication.token = response.access_token;


                localStorageService.set('authorizationData', _authentication);
                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };
        var _addLogin = function (token) {
            $http.post('/api/Account/AddExternalLogin', token).then(function (response) {
                return response;
            });

        };
        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.name = "";
            _authentication.claims = null;
            _authentication.token = "";

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.username = authData.userName;
                _authentication.token = authData.token;
            }

        }

        var _getUserFromEmail = function (email) {
            return $http.post('/api/account/userfromemail?email='+email).then(function (response) {
                return response;
            });

        };
        var _GetUsersForHousehold = function () {
            var household = localStorageService.get('household');
            return $http.post('/api/account/UsersForHousehold?household='+household).then(function (response) {
                return response;
            });
        };
        var _setUser = function (u) {
            authServiceFactory.user = u.data;

        };
        authServiceFactory.getUser = function () {
            return authServiceFactory.user;

        };
        var _setCookie = function () {
            var u = authServiceFactory.getUser();
            if (u.Household == "00000000-0000-0000-0000-000000000000")
            {
                var household = authServiceFactory.AssignUniqueHousehold(u.Id);
            }
            else {
                var household = u.Household;
            }
            localStorageService.set('household', household);
            localStorageService.set('userid', u.Id);

        }

        var _AssignUniqueHousehold = function (userid) {
            return $http.post('/api/account/AssignUniqueHousehold?userid=' + userid).then(function (response) {
                return response.data;
            });
        };
        var _AssignHousehold = function (household) {
            return $http.post('/api/account/AssignHousehold?household=' + household).then(function (response) {
                return response;
            });
        };


        authServiceFactory.AssignHousehold = _AssignHousehold;

        authServiceFactory.AssignUniqueHousehold = _AssignUniqueHousehold;
        authServiceFactory.GetUsersForHousehold=_GetUsersForHousehold;
        authServiceFactory.setCookie = _setCookie;
        authServiceFactory.getUserFromEmail = _getUserFromEmail;
        authServiceFactory.setUser = _setUser;
        authServiceFactory.register = _register;
        authServiceFactory.addLogin = _addLogin;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;

        return authServiceFactory;
    }]);


})();