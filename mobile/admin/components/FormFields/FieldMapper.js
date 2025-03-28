import React from 'react';
import { TextInput } from 'react-native-paper';
import { FormField } from './FormField';
import { StatusField } from './StatusField';
import { ObjectField } from './ObjectField';
import { MultiselectField } from './MultiselectField';
import { DateField } from './DateField';
import { NumberField } from './NumberField';
import { RangeField } from './RangeField';
import { CheckboxField } from './CheckboxField';
import { RadioField } from './RadioField';
import { ImageField } from './ImageField';
import { CameraField } from './CameraField';

export const FieldMapper = (props) => {
    const {
        type,
        field,
        formProps,
        options,
        ...rest
    } = props;

    const { values, handleChange, handleBlur, errors, touched, setFieldValue, isDisabled } = formProps;

    switch (type) {
        case 'text':
            return (
                <FormField
                    field={field}
                    value={values[field]}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );

        case 'number':
            return (
                <FormField
                    field={field}
                    value={values[field]}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    keyboardType="numeric"
                    {...rest}
                />
            );

        case 'textarea':
            return (
                <FormField
                    field={field}
                    value={values[field]}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    multiline
                    numberOfLines={4}
                    {...rest}
                />
            );

        case 'price':
            return (
                <FormField
                    field={field}
                    value={values[field]}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    keyboardType="numeric"
                    leftIcon={<TextInput.Affix text="$" />}
                    {...rest}
                />
            );

        case 'status':
            return (
                <StatusField
                    field={field}
                    value={values[field]}
                    options={options}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );

        case 'object':
            return (
                <ObjectField
                    field={field}
                    value={values[field]}
                    setFieldValue={setFieldValue}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );

        case 'multiselect':
            return (
                <MultiselectField
                    field={field}
                    value={values[field]}
                    options={options}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );

        case 'date':
            return (
                <DateField
                    field={field}
                    value={values[field]}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    mode="date"
                    {...rest}
                />
            );

        case 'time':
            return (
                <DateField
                    field={field}
                    value={values[field]}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    mode="time"
                    {...rest}
                />
            );

        case 'datetime':
            return (
                <DateField
                    field={field}
                    value={values[field]}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    mode="datetime"
                    {...rest}
                />
            );

        case 'number-input':
            return (
                <NumberField
                    field={field}
                    value={values[field]}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );

        case 'range':
            return (
                <RangeField
                    field={field}
                    value={values[field]}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );

        case 'checkbox':
            return (
                <CheckboxField
                    field={field}
                    value={values[field]}
                    options={options}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );

        case 'radio':
            return (
                <RadioField
                    field={field}
                    value={values[field]}
                    options={options}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );

        case 'image':
            return (
                <ImageField
                    field={field}
                    value={values[field]}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );

        case 'camera':
            return (
                <CameraField
                    field={field}
                    value={values[field]}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );

        default:
            return (
                <FormField
                    field={field}
                    value={values[field]}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    touched={touched}
                    disabled={isDisabled}
                    {...rest}
                />
            );
    }
};
