
// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiYXRkeWVyIiwiYSI6IjIyNmFlMTFhYTNkMTlmYjcxZmFiY2M3M2NmNGVmYTc2In0.iLGJmG-AfxcJI-BCYRGfKg';

// Get the placeholder and details
var placeholder = $( '#info-placeholder' );
var details = $( '#current-details' );
var parent_div = $( '#parent-directory' );
var directory_div = $( '#directory' );
var filename_div = $( '#filename' );

// Layers
var layers = [ 'noaa-topobathy', 'usace-lidar', 'ncfmp-lidar' ];

// Parent directories
var parents = {
    'noaa-topobathy': '2014_NOAA_Topobathy_Post_Sandy_1m',
    'usace-lidar': '2010_USACE_NCMP_LIDAR_2m',
    'ncfmp-lidar': '2014_NCFMP_NC_LIDAR_1_5m'
};

var buttons = {
    'noaa-topobathy': $( '#noaa' ),
    'usace-lidar': $( '#usace' ),
    'ncfmp-lidar': $( '#ncfmp' )
};

// Create the map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/atdyer/ciu8ivspe001x2jpccuf28mcu'
});

// The popup
var popup = null;

// The active layer
var active_layer = 'noaa-topobathy';

// Helper functions
var show_details = function () {
    details.toggle( true );
    placeholder.toggle( false );
};

var hide_details = function () {
    details.toggle( false );
    placeholder.toggle( true );
};

// Hide details initially
hide_details();

var show_layer = function ( layer ) {

    if ( popup ) popup.remove();

    for ( var i=0; i<layers.length; ++i ) {
        var l = layers[i];
        if ( l == layer ) {
            active_layer = layer;
            map.setLayoutProperty( active_layer, 'visibility', 'visible' );
            buttons[ l ].addClass( 'active' );
        } else {
            map.setLayoutProperty( l, 'visibility', 'none' );
            buttons[ l ].removeClass( 'active' );
        }
    }
};

map.on( 'load', function () {

    show_layer( 'usace-lidar' );

    map.on( 'mousemove', function ( e ) {

        var features = map.queryRenderedFeatures( e.point, { layers: [ active_layer ] } );
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

    });

    map.on( 'click', function ( e ) {

        var features = map.queryRenderedFeatures( e.point, { layers: [ active_layer ] } );

        if ( !features.length ) {
            hide_details();
            return;
        }

        show_details();

        var feature = features[0];
        var filename = feature.properties.filename;
        var directory = feature.properties.directory;
        var parent = parents[ active_layer ];

        parent_div.text( parent );
        directory_div.text( directory );
        filename_div.text( filename );

        popup = new mapboxgl.Popup()
            .setLngLat( feature.geometry.coordinates )
            .setHTML( feature.properties.filename )
            .addTo( map );

        popup.on( 'close', hide_details );

    });

    for ( var key in buttons ) {
        if ( buttons.hasOwnProperty( key ) ) {
            var button = buttons[ key ];
            button.on( 'click', (function ( key ) {
                return function () {
                    show_layer( key );
                }
            })( key ));
        }
    }

});