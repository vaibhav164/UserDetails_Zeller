import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddUserScreen } from '../src/Screens/AddUser/AddUserScreen';
// import { NewUserScreen } from './NewUserScreen';

describe('NewUserScreen', () => {
  it('renders and validates input fields', () => {
    const mockClose = jest.fn();
    const mockCreate = jest.fn();

    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };
    const { getByPlaceholderText, getByTestId } = render(
      <AddUserScreen navigation={mockNavigation} />
    );

    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'john.doe@email.com');

    fireEvent.press(getByTestId('userRole-Manager'));
    fireEvent.press(getByTestId('createUserBtn'));

    expect(mockCreate).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      role: 'Manager',
    });
  });
});
