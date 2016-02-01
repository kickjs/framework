'use strict';

const ServiceProvider = require( 'kick-ioc/ServiceProvider' );
const Router          = require( 'koa-router' );


class RouterProvider extends ServiceProvider {

    register( ioc ) {

        ioc.singleton( 'router', function *() {

            return new Router();

        } );

    }

}


module.exports = RouterProvider;
