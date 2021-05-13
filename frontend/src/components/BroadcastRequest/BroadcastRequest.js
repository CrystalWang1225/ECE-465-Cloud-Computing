import React, {Component} from 'react';

import Card from '../../hoc/Card/Card';

// MUI imports start
import { withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '../../components/UI/Forms/FormControlLabel/FormControlLabel';
import Switch from "@material-ui/core/Switch";
// MUI imports end

const styles = theme => {
    return {
        TextFields : {
            marginBottom : "10px",
            marginTop : "10px",
            width : "95%"
        }, 
        formControl: {
            width: "80%",
        },
        LastTextField : {
            marginBottom : "10px",
            marginTop : "-10px",
            width : "95%"
        },
    }
}


class BroadcastRequest extends Component {

    componentDidMount(){
        ValidatorForm.addValidationRule('isOldEnough', (value) => {
            if (value.trim() < 18) {
                return false;
            }
            return true;
        });

        ValidatorForm.addValidationRule('isSmallEnough', (value) => {
            if (value.trim().length >= 256) {
                return false;
            }
            return true;
        });

        ValidatorForm.addValidationRule('isTenDigits', (value) => {
            if (value.trim().length < 10 || value.trim().length > 10  ) {
                return false;
            }
            return true;
        });
    }

    render(){
        return(
            <Card>
            <h1 className = "h2 heading font-weight-bold">Emergency Blood Bag Requests</h1>
            <p className = "Error">{this.props.error ? this.props.error  : null}</p>                
            <ValidatorForm
                ref="form"
                onSubmit={this.props.handleSubmit}
                onError={errors => console.log(errors)}>
                
    
                <FormControl className={this.props.classes.TextFields}>
                    <InputLabel htmlFor="bg">Blood Group</InputLabel>
                    <Select
                        value={this.props.bloodGroup}
                        onChange={this.props.handleChange}
                        inputProps={{
                            name: 'bloodGroup',
                            id: 'bg',
                        }}>
                        <MenuItem value={"A+"}>A+</MenuItem>
                        <MenuItem value={"A-"}>A-</MenuItem>
                        <MenuItem value={"B+"}>B+</MenuItem>
                        <MenuItem value={"B-"}>B-</MenuItem>
                        <MenuItem value={"AB+"}>AB+</MenuItem>
                        <MenuItem value={"AB-"}>AB-</MenuItem>
                        <MenuItem value={"O+"}>O+</MenuItem>
                        <MenuItem value={"O-"}>O-</MenuItem>
                    </Select>
                </FormControl><br/>
                
                <TextValidator
                    className = {this.props.classes.TextFields}
                    label="Number of Bags"
                    onChange={this.props.handleChange}
                    name="numberBags"
                    value={this.props.numberBags}
                    validators={['required','matchRegexp:^[0-9]*$']}
                    errorMessages={['This field is required', 'Please enter number']}/><br/>
    
                <Button 
                    variant="contained" 
                    color="secondary" 
                    type="submit">{this.props.isDonor ? "Update" : "Register"}</Button>
            </ValidatorForm>
        </Card>
        )
    }
}

export default withStyles(styles)(BroadcastRequest);