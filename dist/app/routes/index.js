"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const event_routes_1 = require("../modules/events/event.routes");
const review_route_1 = require("../modules/review/review.route");
const booking_route_1 = require("../modules/bookings/booking.route");
const payment_route_1 = require("../modules/payments/payment.route");
const state_route_1 = require("../modules/states/state.route");
const contact_route_1 = require("../modules/contact/contact.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.UserRoutes
    },
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes
    },
    {
        path: '/event',
        route: event_routes_1.EventRoutes
    },
    {
        path: '/review',
        route: review_route_1.ReviewRoutes
    },
    {
        path: '/booking',
        route: booking_route_1.BookingRoutes
    },
    {
        path: '/payment',
        route: payment_route_1.PaymentRoutes
    },
    {
        path: '/state',
        route: state_route_1.StateRoutes
    },
    {
        path: '/contact',
        route: contact_route_1.ContactRoutes
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
