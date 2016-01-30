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

        let paths = [];
        let path  = _.get( this.env, 'paths.app' );
        let mode  = _.get( this.env, 'mode', 'development' );

        if ( path )
        {
            paths.push( path + '/Config' );

            if ( mode )
            {
                paths.push( path + '/Config/' + mode );
            }
        }

        return Promise
            .all( paths )
            .mapSeries( path => this._load( path ) )
            .each( config => {

                merge( this.config, config );

            } )
            .return( this );

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
