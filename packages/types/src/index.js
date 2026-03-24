'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ScanResult =
  exports.PaymentGateway =
  exports.PaymentStatus =
  exports.TicketStatus =
  exports.EventStatus =
  exports.AuthProvider =
  exports.UserRole =
    void 0;
// Enums compartidos
var UserRole;
(function (UserRole) {
  UserRole['USER'] = 'USER';
  UserRole['STAFF_SCANNER'] = 'STAFF_SCANNER';
  UserRole['ADMIN_VENUE'] = 'ADMIN_VENUE';
})(UserRole || (exports.UserRole = UserRole = {}));
var AuthProvider;
(function (AuthProvider) {
  AuthProvider['LOCAL'] = 'LOCAL';
  AuthProvider['GOOGLE'] = 'GOOGLE';
  AuthProvider['APPLE'] = 'APPLE';
})(AuthProvider || (exports.AuthProvider = AuthProvider = {}));
var EventStatus;
(function (EventStatus) {
  EventStatus['DRAFT'] = 'DRAFT';
  EventStatus['PUBLISHED'] = 'PUBLISHED';
  EventStatus['CANCELLED'] = 'CANCELLED';
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var TicketStatus;
(function (TicketStatus) {
  TicketStatus['PENDING'] = 'PENDING';
  TicketStatus['ACTIVE'] = 'ACTIVE';
  TicketStatus['VALIDATED'] = 'VALIDATED';
  TicketStatus['EXPIRED'] = 'EXPIRED';
  TicketStatus['CANCELLED'] = 'CANCELLED';
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
  PaymentStatus['PENDING'] = 'PENDING';
  PaymentStatus['SUCCEEDED'] = 'SUCCEEDED';
  PaymentStatus['FAILED'] = 'FAILED';
  PaymentStatus['REFUNDED'] = 'REFUNDED';
  PaymentStatus['DISPUTED'] = 'DISPUTED';
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentGateway;
(function (PaymentGateway) {
  PaymentGateway['STRIPE'] = 'STRIPE';
  PaymentGateway['WOMPI'] = 'WOMPI';
  PaymentGateway['MERCADOPAGO'] = 'MERCADOPAGO';
})(PaymentGateway || (exports.PaymentGateway = PaymentGateway = {}));
var ScanResult;
(function (ScanResult) {
  ScanResult['SUCCESS'] = 'SUCCESS';
  ScanResult['INVALID'] = 'INVALID';
  ScanResult['DUPLICATE'] = 'DUPLICATE';
  ScanResult['EXPIRED'] = 'EXPIRED';
})(ScanResult || (exports.ScanResult = ScanResult = {}));
//# sourceMappingURL=index.js.map
