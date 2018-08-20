import * as React from "react";
import { Frame, PropertyControls, ControlType } from "framer";

export class Translate_Text extends React.Component {

    static defaultProps = {
        width: 150,
        height: 30,
        text: "Hello"
        language: "🇺🇸",
        apikey: "",
        typeface: "Helvetica",
        custom: "",
        weight: 400,
        size: 16,
        line: 1.2,
        color: "black",
        align: "center",
        background: "rgba(0,0,0,0)",
        radius: 0,
    };

    static propertyControls = {
        text: {
            type: ControlType.String,
            title: "Text",
            placeholder: "Write something",
        },
        language: {
            type: ControlType.SegmentedEnum,
            title: "Translate to",
            options: ["🇺🇸", "🇷🇺", "🇯🇵", "🇩🇪"],
        },
        apikey: {
            type: ControlType.String,
            title: "API Key",
            placeholder: "Enter your key",
        },
        typeface: {
            type: ControlType.Enum,
            title: "Typeface",
            options: ["Helvetica", "Arial", "Times", "Courier", "Verdana", "Tahoma"],
        }
        weight: {
            type: ControlType.Number,
            title: "Weight",
            max: 800,
            min: 100,
            step: 100,
        },
        size: {
            type: ControlType.Number,
            title: "Size",
            max: 200,
            min: 1,
        },
        color: {
            type: ControlType.Color,
            title: "Color",
        },
        line: {
            type: ControlType.Number,
            title: "Line-height",
            max: 4,
            min: 0,
            step: 0.1,
        },
        align: {
            type: ControlType.SegmentedEnum,
            title: "Align",
            options: ["left", "center", "right"],
        },
        background: {
            type: ControlType.Color,
            title: "Background",
        },
        radius: {
            type: ControlType.Number,
            title: "Radius",
            max: 50,
            min: 0,
        },
    };

    state = {
        text: "Hello";
    };

    translate = (text = "hello", toLang = "ru", fromLang = "en") => {
        if (this.props.apikey) {
            this.paidGoogleTranslate(text, toLang, fromLang)
        } else {
            this.freeGoogleTranslate(text, toLang, fromLang)
        }
    }

    // This free API will break after a dozen or so requests. Inspired by: https://ctrlq.org/code/19909-google-translate-api
    freeGoogleTranslate = (text, toLang, fromLang) => {
            
        let url = `https://translate.googleapis.com/translate_a/single?client=gtx`;

        url += `&sl=${fromLang}`;
        url += `&tl=${toLang}`;
        url += `&dt=t&q=${text}`;

        fetch(url, { 
            method: 'GET'
        })
        .then(res => res.json())
        .then((response) => {
            let translatedText = response[0][0][0];
            this.setState({text: translatedText});
            console.log(`Translating ${text} from ${fromLang} to ${toLang} via free Google Translate. Result: ${translatedText}.`);
        })
        .catch(error => {
            this.setState({text: "Quota limit hit. Enter a Google Cloud API Key."});
            console.log("There was an error with the translation request: ", error);
        });
    }

    // The official Google Cloud API for Translate.
    paidGoogleTranslate = (text, toLang, fromLang) => {

        // 'AIzaSyDw7UEAvRdCRUnX3l4tdHDyTz4hH-Qjycc'
        const API_KEY = this.props.apikey;

        let url = `https://www.googleapis.com/language/translate/v2?key=${API_KEY}`;

        url += `&source=${fromLang}`;
        url += `&target=${toLang}`;
        url += `&q=${text}`;

        fetch(url, { 
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        })
        .then(res => res.json())
        .then((response) => {
            let translatedText = response.data.translations[0].translatedText;
            this.setState({text: translatedText});
            console.log(`Translating ${text} from ${fromLang} to ${toLang} via paid Google Cloud. Result: ${translatedText}.`);
        })
        .catch(error => {
            console.log("There was an error with the translation request: ", error);
        });
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.language !== this.props.language || nextProps.text !== this.props.text) {

            if (nextProps.language === "🇷🇺") {
                this.translate(nextProps.text, 'ru');
            } else if (nextProps.language === "🇯🇵") {
                this.translate(nextProps.text, 'ja');
            } else if (nextProps.language === "🇩🇪") {
                this.translate(nextProps.text, 'de');
            } else {
                this.setState({text: nextProps.text});
            }
        }
    }

    render() {

        return (
            <div style={{
                height: "100%",
                width: "100%",
                fontFamily: this.props.typeface,
                fontWeight: this.props.weight,
                fontSize: this.props.size,
                lineHeight: this.props.line,
                color: this.props.color,
                textAlign: this.props.align,
                background: this.props.background,
                borderRadius: this.props.radius,
                }}>

            {this.state.text}
            
            </div>
        );
    }
}


