import React, { Component } from "react";
import { bindActionCreators } from 'redux'
import * as pageActions from '../actions/PageActions'
import { connect } from 'react-redux'
import BigNumber from "bignumber.js";
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import "./CoursesConverter.css";
import { relative } from "path";

/** Функция обрезает число до 15 чисел, для использования в библиотеке BigNumber */
function trim_digits(number_) {
    var count = 15;
    var s = number_.toString();
    if (s.indexOf(".") > -1)
        return parseFloat(s.length > count + 1 ? s.substr(0, count + 1) : s);
    else
        return parseFloat(s.length > count ? s.substr(0, count) : s);
}

/** Обрезает число до 14 знаков после запятой */
function trim(number) {
    return trim_digits(number);
}

/** Обрезает число до указанного количества знаков после запятой */
function trim_float(number, count) {
    var count_ = 1;
    for (var i = 0; i < count; i++) {
        count_ = count_ * 10;
    }
    return (Math.floor(number * count_)) / count_;
}


class CoursesConverterCnt extends Component {
    constructor(props) {
        super(props);
    }

    onChangeFirstItem(event, index, value) {
        this.props.pageActions.setExchangeItems(this.getCurrencyById(value), this.props.first_course_amount, this.props.second_course_item, this.props.second_course_amount);
    }

    onChangeSecondItem(event, index, value) {
        this.props.pageActions.setExchangeItems(this.props.first_course_item, this.props.first_course_amount, this.getCurrencyById(value), this.props.second_course_amount);
    }

    onChangeFirstCourseAmount(event, value) {
        this.props.pageActions.setExchangeItems(this.props.first_course_item, value, this.props.second_course_item, this.props.second_course_amount);
    }

    onClickCalculate() {
        this.props.pageActions.updateCoursesFromSite(() => {
            var amount_end_currency = this.convert_courses(this.props.first_course_item, this.props.first_course_amount, this.props.second_course_item);
            this.props.pageActions.setExchangeItems(this.props.first_course_item, this.props.first_course_amount, this.props.second_course_item, amount_end_currency);
        });        
    }

    convert_courses(first_item, first_item_amount, second_item) {
        //Переводим из начальной валюты в базовую
        var amount_to_base_currency = new BigNumber(trim(first_item.price_usd)).multipliedBy(trim(first_item_amount));
        //Переводим из базовой валюты в конечную
        var amount_end_currency = amount_to_base_currency.dividedBy(second_item.price_usd);
        return trim_float(amount_end_currency.toNumber(), 6);
    }

    getCurrencyById(id) {
        for (var i = 0; i < this.props.courses_list.length; i++) {
            if (this.props.courses_list[i].id === id)
                return this.props.courses_list[i];
        }
        return {
            id: "",
            name: "",
            price_usd: 0
        }
    }

    render() {
        const style = {
            height: "100%",
            width: 1100,
            margin: 20,
            textAlign: 'center',
            display: 'inline-block',
            paddingBottom: 40,
            position: "relative"
        };
        const styles = {
            headline: {
                fontSize: 24,
                fontWeight: 400,
            },
            otkuda_kuda: {
                fontSize: 16,
                fontWeight: 400,
            }
        }
        return (
            <div className="contaner">

                <Paper style={style} zDepth={1} >
                    <h2 style={styles.headline}>Конвертер валют</h2>

                    <h3 style={styles.otkuda_kuda}>From</h3>
                    <div className="container__wrap_from">
                        <SelectField
                            className="container__wrap_from__select_field"
                            value={this.props.first_course_item.id}
                            onChange={this.onChangeFirstItem.bind(this)}>
                            {
                                this.props.courses_list.map((item, index) => {
                                    return (
                                        <MenuItem key={"first_" + index} value={item.id} primaryText={item.name} />
                                    )
                                })
                            }
                        </SelectField>
                        <TextField
                            hintText="Hint Text"
                            value={this.props.first_course_amount}
                            onChange={this.onChangeFirstCourseAmount.bind(this)}
                        />
                    </div>
                    <h3 style={styles.otkuda_kuda}>to</h3>
                    <div className="container__wrap_to">
                        <SelectField
                            className="container__wrap_to__select_field"
                            value={this.props.second_course_item.id}
                            onChange={this.onChangeSecondItem.bind(this)}
                        >
                            {
                                this.props.courses_list.map((item, index) => {
                                    return (
                                        <MenuItem key={"second_" + index} value={item.id} primaryText={item.name} />
                                    )
                                })
                            }
                        </SelectField>
                        {this.props.second_course_amount}
                    </div>
                    <div className="container__wrap_submit_button">
                        <Button variant="raised" onClick={this.onClickCalculate.bind(this)}>   Расчитать   </Button>
                    </div>
                    {
                        this.props.fetch ? 
                        <div className="wrapper_for_progress">
                        <RefreshIndicator
                            size={100}
                            left={0}
                            top={0}
                            loadingColor="#FF9800"
                            status="loading"
                            style={{
                                display: 'inline-block',
                                position: 'relative',
                            }}
                        />
                        </div>
                        :
                        ''
                    }

                </Paper>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        courses_list: state.courses.courses_list,
        first_course_item: state.courses.first_course_item,
        second_course_item: state.courses.second_course_item,
        first_course_amount: state.courses.first_course_amount,
        second_course_amount: state.courses.second_course_amount,
        fetch: state.courses.fetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        pageActions: bindActionCreators(pageActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesConverterCnt);