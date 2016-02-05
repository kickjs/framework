'use strict';

const ServiceProvider = require( 'kick-ioc/ServiceProvider' );
const Koa             = require( 'koa' );


class KoaProvider extends ServiceProvider {

    register( ioc ) {

        ioc.singleton( 'Koa', function () {

            return new Koa();

        } );

    }

}


module.exports = KoaProvider;
