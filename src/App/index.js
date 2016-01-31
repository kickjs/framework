'use strict';

const _       = require( 'lodash' );
const Promise = require( 'bluebird' );
const Glob    = Promise.promisify( require( 'glob' ) );


class Config {

    static get services() {

        return [ 'env' ];

    }

    constructor( services ) {

        Object.assign( this, services, {
            config: {}
        } );

        return this.load();

    }

    get( ...args ) {

        return _.get( this.config, ...args );

    }

    set( ...args ) {

        return _.set( this.config, ...args );

    }

    has( ...args ) {

        return _.has( this.config, ...args );

    }

    load() {

        let path = _.get( this.env, 'paths.app' );

        return Glob( '*/config/**.js', { cwd: path, nomount: true } )
            .mapSeries( file =>
                _( file )
                    .replace( /\.js$/gi, '' )
                    .trim( '\\\/' )
                    .split( /[\\\/]/g )
                    .splice( 1, 1 )
                    .value()
            )
            .then( console.log )



    }

    _load( path ) {

        return Glob( '*.js', { cwd: path, nomount: true } )
            .reduce( ( config, file ) => {

                let name = _.chain( file )
                    .replace( /\.js$/gi, '' )
                    .trim( '\\\/' )
                    .value();

                let value = require( path + '/' + file );

                config[ name ] = _.isPlainObject( value )
                    ? value
                    : {};

                return config;

            }, {} );

    }

}


function merge( a, b ) {

    if ( !_.isPlainObject( a ) || !_.isPlainObject( b ) )
    {
        return b;
    }

    return _.merge( a, b, merge );

}


module.exports = Config;
