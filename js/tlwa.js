/*
 * Copyright (c) 2013 Marco van Hylckama Vlieg
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ (function () {
    var night;
    var weathericons = {
        "200": ["thunder.png", "rain_medium.png"],
        "201": ["thunder.png", "rain_heavy.png"],
        "202": ["thunder.png", "rain_heavy.png"],
        "210": ["thunder.png"],
        "211": ["thunder.png"],
        "212": ["thunder.png"],
        "221": ["thunder.png"],
        "230": ["thunder.png", "drizzle.png"],
        "231": ["thunder.png", "drizzle.png"],
        "232": ["thunder.png", "drizzle.png"],
        "300": ["drizzle.png"],
        "301": ["drizzle.png"],
        "302": ["drizzle.png"],
        "310": ["rain_medium.png"],
        "311": ["rain_heavy.png"],
        "312": ["rain_heavy.png"],
        "321": ["showers.png"],
        "500": ["rain_medium.png"],
        "502": ["rain_heavy.png"],
        "503": ["rain_heavy.png"],
        "504": ["rain_heavy.png"],
        "511": ["rain_medium.png"],
        "520": ["showers.png"],
        "521": ["showers.png"],
        "522": ["showers.png"],
        "600": ["snow.png"],
        "601": ["snow.png"],
        "602": ["snow_strong.png"],
        "622": ["snow.png"],
        "611": ["sleet.png"],
        "621": ["showers.png"],
        "701": ["mist.png"],
        "711": ["mist.png"],
        "721": ["haze.png"],
        "731": ["mist.png"],
        "741": ["fog.png"],
        "800": ["clear_day.png"],
        "801": ["half_day.png"],
        "802": ["half_day.png"],
        "803": ["half_day.png"],
        "804": ["cloudy.png"],
        "900": ["tornado.png"],
        "901": ["tornado.png"],
        "902": ["tornado.png"],
        "903": [""],
        "904": [""],
        "905": ["wind.png"],
        "906": ["hail.png"]
    }
    var weathercodes = {
        "200": "some <strong>fucking thunderstorms</strong> with a bit of rain",
        "201": "some <strong>fucking thunderstorms</strong> and it's pissing down",
        "202": "some <strong>fucking thunderstorms</strong> with apocalyptic rain",
        "210": "lame <strong>thunderstorms</strong>",
        "211": "a <strong>fucking thunderstorm</strong>",
        "212": "a big <strong>fucking thunderstorm</strong>",
        "221": "a <strong>fucking ragged thunderstorm</strong>",
        "230": "a <strong>fucking thunderstorm</strong> with light drizzle",
        "231": "a <strong>fucking thunderstorm</strong> with drizzle",
        "232": "a <strong>fucking thunderstorm</strong> with heavy drizzle",
        "300": "light <strong>fucking drizzle</strong>",
        "301": "a <strong>fucking drizzle</strong>",
        "302": "heavy <strong>fucking drizzle</strong>",
        "310": "it's <strong>pissing down</strong> lightly",
        "311": "it's <strong>pissing down</strong>",
        "312": "it's <strong>pissing down</strong> heavily",
        "321": "<strong>Pissing showers</strong>",
        "500": "it's <strong>pissing down</strong> lightly",
        "501": "it's <strong>pissing down</strong> moderately",
        "502": "it's <strong>fucking raining</strong> right now",
        "503": "it's <strong>fucking raining</strong>, monsoon style",
        "504": "an <strong>apocalyptic downpour</strong>. Prepare fucking boats",
        "511": "there's freezing <strong>fucking rain</strong>",
        "520": "there are light <strong>fucking showers</strong>",
        "521": "there are <strong>fucking showers</strong>",
        "522": "there are heavy <strong>fucking showers</strong>",
        "600": "there is <strong>fucking light snow</strong>",
        "601": "it's <strong>fucking snowing</strong> right now",
        "602": "tons of <strong>fucking snow</strong>",
        "622": "tons of <strong>fucking shower snow</strong>",
        "611": "fucking <strong>sleet</strong>",
        "621": "nasty <strong>fucking shower sleet</strong>",
        "701": "we have <strong>fucking mist</strong>",
        "711": "we have <strong>fucking smoke</strong>",
        "721": "we see <strong>fucking haze</strong>",
        "731": "we have <strong>fucking sand/dust whirls</strong>",
        "741": "yay, <strong>fucking fog</strong>",
        "800": "clear <strong>fucking skies</strong>",
        "801": "a few <strong>fucking clouds</strong>",
        "802": "scattered <strong>fucking clouds</strong>",
        "803": "broken <strong>fucking clouds</strong>",
        "804": "there are <strong>fucking overcast clouds</strong>",
        "900": "a <strong>fucking tornado</strong> is raging",
        "901": "a <strong>fucking tropical storm</strong> is raging",
        "902": "a <strong>fucking hurricane</strong> is raging",
        "903": "extreme <strong>fucking cold</strong>",
        "904": "extreme <strong>fucking heat</strong>",
        "905": "it's <strong>windy as fuck</strong>",
        "906": "it's <strong>fucking hailing</strong> right now"
    }

    var temperatures = [];
    temperatures[0] = "Hell is <strong>freezing</strong> over.";
    temperatures[1] = "It's <strong>cold as fuck</strong>.";
    temperatures[2] = "It's <strong>fucking chilly</strong>.";
    temperatures[3] = "It's sort of ok.";
    temperatures[4] = "It feels pretty <strong>fucking nice</strong>.";
    temperatures[5] = "It's pretty <strong>fucking hot</strong>.";
    temperatures[6] = "It's <strong>hot as fuck</strong>.";

    function appWorld() {

        // fire up appWorld with a predefined app. In this case it's Screamager

        blackberry.invoke.invoke({
            uri: "http://appworld.blackberry.com/webstore/content/22052928"
        }, onInvokeSuccess, onInvokeError);
    };

    function onInvokeSuccess() {
        console.log("Invocation successful.");
    }

    function onInvokeError(error) {
        console.log("Invocation failed, error: " + error);
    }

    function getWeather() {

        $('#weather').html('<div id="loader"><p id="fetching">Fetching info you already have. Just fucking wait and be patient, it may take a while.</p></div>');

        var loc = navigator.geolocation.getCurrentPosition(showWeather);

        function showWeather(position) {
            var lat = Math.round(position.coords.latitude * 10000) / 10000;
            var lon = Math.round(position.coords.longitude * 10000) / 10000;
            night = isNight(lat, lon);

            $.getJSON('http://api.openweathermap.org/data/2.1/find/city?lat=' + lat + '&lon=' + lon + '&cnt=1', function (data) {
                var tempnode;
                var tempicon;
                var weather = '';
                var weathericonstrip = '';
                var out;
                var weatheritems = 0;
                var datetest = new Date();
                var dot = '';
                var d = new Date();
                var hours = d.getHours();
                var minutes = d.getMinutes();
                var seconds = d.getSeconds();
                if (hours < 10) {
                    hours = '0' + hours;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }

                var bbmmessage = 'My weather: ';
                if (data.list[0].weather) {
                    for (var i = 0; i < data.list[0].weather.length; i++) {
                        if (i == data.list[0].weather.length - 1) {
                            dot = '.';
                        }
                        if (weatheritems > 0) {
                            weather += '<div class="weatherdescription"> and ' + weathercodes[data.list[0].weather[i].id].replace(/fucking/, 'bloody') + dot + '</div>';
                            bbmmessage = bbmmessage + ' and ' + weathercodes[data.list[0].weather[i].id].replace(/fucking/, 'bloody') + dot;
                        } else {
                            weatheritems++;
                            weather += '<div class="weatherdescription">' + weathercodes[data.list[0].weather[i].id].charAt(0).toUpperCase() + weathercodes[data.list[0].weather[i].id].slice(1) + dot + '</div>';
                            bbmmessage = bbmmessage + weathercodes[data.list[0].weather[i].id].charAt(0).toUpperCase() + weathercodes[data.list[0].weather[i].id].slice(1) + dot;
                        }
                        for (var k = 0; k < weathericons[data.list[0].weather[i].id].length; k++) {
                            if (!weathericonstrip.match(weathericons[data.list[0].weather[i].id][k])) {
                                weathericonstrip = weathericonstrip + '<img src="img/' + weathericons[data.list[0].weather[i].id][k] + '" />';
                            }
                        }
                    }

                    // strip the HTML for the BBM status message

                    bbmmessage = bbmmessage.replace(/<(?:.|\n)*?>/gm, '');

                    if (night) {
                        weathericonstrip = weathericonstrip.replace(/day/g, 'night');
                        blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_IMAGE, {
                            path: 'local:///img/c_' + weathericons[data.list[0].weather[0].id][0].replace(/day/g, 'night').replace('.png', '_n.png')
                        });
                    } else {
                        blackberry.ui.cover.setContent(blackberry.ui.cover.TYPE_IMAGE, {
                            path: 'local:///img/c_' + weathericons[data.list[0].weather[0].id][0]
                        });
                    }
                    avg_temp = ((data.list[0].main.temp_max + data.list[0].main.temp_min) / 2) - 273.15;

                    // set Active Cover

                    blackberry.ui.cover.labels.push({
                        label: '(' + Math.round((avg_temp * 1.8) + 32) + 'F / ' + Math.round(avg_temp) + 'C)',
                        size: 10,
                        wrap: true
                    });
                    blackberry.ui.cover.labels.push({
                        label: bbmmessage.replace("My weather: ", ""),
                        size: 10,
                        wrap: true
                    });

                    function onEnterCover() {
                        blackberry.ui.cover.updateCover();
                    }

                    blackberry.event.addEventListener("entercover", onEnterCover);
                    // Choose which temperature icon and message to show

                    if (avg_temp < -15) {
                        tempnote = temperatures[0];
                        bbmmessage = bbmmessage + ' ' + temperatures[0];
                        tempicon = '<img src="img/temp_0.png" />';
                    }
                    if (avg_temp > -15 && avg_temp <= -5) {
                        tempnote = temperatures[1];
                        bbmmessage = bbmmessage + ' ' + temperatures[1];
                        tempicon = '<img src="img/temp_1.png" />';
                    }
                    if (avg_temp > -5 && avg_temp <= 5) {
                        tempnote = temperatures[2];
                        bbmmessage = bbmmessage + ' ' + temperatures[2];
                        tempicon = '<img src="img/temp_2.png" />';
                    }
                    if (avg_temp > 5 && avg_temp <= 18) {
                        tempnote = temperatures[3];
                        bbmmessage = bbmmessage + ' ' + temperatures[3];
                        tempicon = '<img src="img/temp_3.png" />';
                    }
                    if (avg_temp > 18 && avg_temp <= 25) {
                        tempnote = temperatures[4];
                        bbmmessage = bbmmessage + ' ' + temperatures[4];
                        tempicon = '<img src="img/temp_4.png" />';
                    }
                    if (avg_temp > 25 && avg_temp <= 35) {
                        tempnote = temperatures[5];
                        bbmmessage = bbmmessage + ' ' + temperatures[5];
                        tempicon = '<img src="img/temp_5.png" />';
                    }
                    if (avg_temp > 35) {
                        tempnote = temperatures[6];
                        bbmmessage = bbmmessage + ' ' + temperatures[6];
                        tempicon = '<img src="img/temp_5.png" />';
                    }
                }
                bbmmessage = bbmmessage + ' ' + '(' + Math.round((avg_temp * 1.8) + 32) + 'F / ' + Math.round(avg_temp) + 'C)';
                out = '<div class="weathericons">' + weathericonstrip + '</div>';
                out = out + '<div id="weatherpanel">';
                out = out + '<p id="loc">You\'re near fucking ' + data.list[0].name + '.</p>';
                out = out + '<p id="myweather">The fucking weather right now (' + hours + ':' + minutes + ') :</p>';
                out = out + '<div class="weathertext">' + weather + '</div>';
                out = out + '<div class="temp">' + tempicon + '<div class="temptext">' + tempnote + '<br /><span class="temperature">(' + Math.round((avg_temp * 1.8) + 32) + '&deg;F / ' + Math.round(avg_temp) + '&deg;C)</span></div></div>';
                if (night) {
                    out = out + '<div class="footnote">I could look outside for more information but it\'s <strong>fucking dark</strong> right now...</div>';
                } else {
                    out = out + '<div class="footnote">I could look outside for more information...</div>';
                }
                out = out + '<div class="poweredby">The Last Weather App. By Marco van Hylckama Vlieg.<br/>Only on BlackBerry&reg; 10</div>';
                out = out + '</div>';
                out = out + '<div id="menu"><div id="bbm"></div><div id="share"></div><div id="refresh"></div><div id="info"></div></div>';
                if (night) {
                    out = out.replace(/\.png/g, '_n.png');
                }
                if (night) {
                    $('body').addClass('night');
                } else {
                    $('body').removeClass('night');
                }
                $('#weather').html(out);

                $('#loc, #bbm, #info, #share, #refresh').hide();

                html2canvas(document.getElementById('weather'), {
                    // first, create a canvas version of the weather screen
                    onrendered: function (canvas) {
                        // second, save the canvas as an image
                        saveCanvas(canvas);
                        if (night) {
                            $('.footnote').html('You could look outside for more information but it\'s <strong>fucking dark</strong>.');
                        } else {
                            $('.footnote').html('You can look outside for more information.');
                        }
                        $('#loc, #bbm, #info, #share, #refresh').show();
                        $('.poweredby, #myweather').remove();
                    }
                });

                $('#weather').after('<div id="infoscreen"><h1>The <strong>Last</strong> Weather App</h1><p>By Marco van Hylckama Vlieg</p><p>Copyright &copy; 2013</p><p>Based on an idea by Tobias van Schneider</p><p>Powered by <strong>openweathermap.org</strong></p><div id="applink">Love this? Try Screamager! <img src="img/scrmicon.png"></div><div id="returnbtn">&raquo; Return</div></div><div id="bbmscreen"><h2>BBM</h2><ul><li id="bbmupdate">&raquo; Set Personal Weather Message</li><li id="bbmdownload">&raquo; Invite to Download</li><li id="return">&raquo; Return</li></ul></div>');

                $('#infoscreen, #bbmscreen').hide();

                $('#returnbtn, #bbmscreen li, #applink')
                    .bind('touchstart', function (e) {
                    e.target.style.background = '#cccccc';
                })
                    .bind('touchend', function (e) {
                    e.target.style.background = 'transparent';
                });

                $(document)
                    .bind('touchend', function (e) {

                    // handler for all possible UI interactions

                    var request;

                    switch (e.target.id) {

                        case 'menu':
                            $('#menu').toggleClass('on');
                            break;

                        case 'info':
                            $('#weather, #bbmscreen').hide();
                            $('#infoscreen').show();
                            $('#menu').removeClass('on');
                            $('#menu').hide();
                            break;

                        case 'returnbtn':
                            $('#weather').show();
                            $('#infoscreen, #bbmscreen').hide();
                            $('#menu').show();
                            break;

                        case 'refresh':
                            $(document).unbind();
                            $('body').html('<div id="weather"></div>');
                            getWeather();
                            break;

                        case 'bbm':
                            $('#weather, #infoscreen').hide();
                            $('#bbmscreen').show();
                            $('#menu').removeClass('on');
                            $('#menu').hide();
                            break;

                        case 'share':
                            // use invoke framework to share the previously created image of the user's current weather situation
                            $('#menu').removeClass('on');
                            request = {
                                action: 'bb.action.SHARE',
                                uri: 'file://' + blackberry.io.sharedFolder + '/documents/tlwa.png',
                                target_type: ["CARD"]
                            };
                            blackberry.invoke.card.invokeTargetPicker(request, 'Share your misery',
                            // success
                            function () {},

                            // error
                            function (e) {
                                console.log(e);
                            });
                            break;

                        case 'return':
                            $('#weather').show();
                            $('#infoscreen, #bbmscreen').hide();
                            $('#menu').show();
                            break;

                        case 'bbmupdate':
                            if (bbm.registered) {
                                bbm.save(bbmmessage);
                            }
                            break;

                        case 'bbmdownload':
                            if (bbm.registered) {
                                bbm.inviteToDownload();
                            }
                            break;

                        case 'applink':
                            appWorld();
                            break;

                        default:
                            $('#menu').removeClass('on');
                            break;
                    }
                });
            }).error(function () {
                out = '<div class="weathertext">Error fetching the weather.</div><div class="footnote">Looks like you\'re gonna have to look outside after all.</div>';
                $('#weather').html(out);
            });
        }
    }

    $(document).ready(function () {
        getWeather();
    });
})();