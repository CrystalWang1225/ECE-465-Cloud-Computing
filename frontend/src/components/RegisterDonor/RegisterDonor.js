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


class RegisterDonor extends Component {

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
            <h1 className = "h2 heading font-weight-bold">Register as Donor</h1>
            <p className = "Error">{this.props.error ? this.props.error  : null}</p>                
            <ValidatorForm
                ref="form"
                onSubmit={this.props.handleSubmit}
                onError={errors => console.log(errors)}>
                
                <TextValidator
                    className = {this.props.classes.TextFields}
                    label="Name"
                    onChange={this.props.handleChange}
                    name="name"
                    value={this.props.name}
                    validators={['required','isSmallEnough']}
                    errorMessages={['This field is required', 'Maximum 255 Characters are allowed']}/><br/>
                
                <TextValidator
                    className = {this.props.classes.TextFields}
                    label="Age"
                    onChange={this.props.handleChange}
                    name="age"
                    value={this.props.age}
                    validators={['required', 'isOldEnough','matchRegexp:^[0-9]*$']}
                    errorMessages={['This field is required', 'You are not old enough to donate','Invalid Age']}/><br/><br/>
                
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                    aria-label="Gender"
                    name="gender"
                    value={this.props.gender}
                    onChange={this.props.handleChange}>
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
    
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
                    label="Phone Number"
                    onChange={this.props.handleChange}
                    name="phone"
                    value={this.props.phone}
                    validators={['required','matchRegexp:^[0-9]*$','isTenDigits']}
                    errorMessages={['This field is required', 'Invalid Phone Number','Phone Number must have 10 digits']}/><br/>
                
                {/* <FormControlLabel
                    control={<Switch
                                checked={this.props.available}
                                onChange={this.props.switchAvailability('available')}
                                value="available"/>}
                    label="Available"
                    labelPlacement = "start"/><br/> */}
    
                <Button 
                    variant="contained" 
                    color="secondary" 
                    type="submit">{this.props.isDonor ? "Update" : "Register"}</Button>
            </ValidatorForm>
        </Card>
        )
    }
}

export default withStyles(styles)(RegisterDonor);