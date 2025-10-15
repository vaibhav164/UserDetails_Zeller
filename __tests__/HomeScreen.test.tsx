import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/Screens/HomeScreen/HomeScreen';
import { useQuery } from '@apollo/client/react';
import * as DB from '../src/LocalDB/LocalDB';
import * as LocalStorage from '../src/LocalDB/LocalStograge';

// Mock GraphQL data
const mockData = {
  listZellerCustomers: {
    items: [
      { id: '1', name: 'Alice', role: 'Admin' },
      { id: '2', name: 'Bob', role: 'Manager' },
    ],
  },
};

describe('HomeScreen', () => {
  beforeEach(() => {
    (useQuery as unknown as jest.Mock).mockReturnValue({
      loading: false,
      error: undefined,
      data: mockData,
    });

    jest.spyOn(DB, 'getDBConnection').mockResolvedValue({
      executeSql: jest.fn(async (query: string) => {
        if (query.includes('SELECT')) {
          // Return mocked users consistent with mockData or empty if needed
          return [
            {
              rows: {
                length: 2,
                item: (i: number) => mockData.listZellerCustomers.items[i],
              },
            },
          ];
        }
        return [];
      }),
    } as any);
    jest.spyOn(DB, 'createTables').mockResolvedValue();
    jest.spyOn(DB, 'saveUsers').mockResolvedValue();
    jest.spyOn(DB, 'getUsers').mockResolvedValue(mockData?.listZellerCustomers?.items);
    jest.spyOn(LocalStorage, 'deleteUser').mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a list of users grouped and filters by role', async () => {
    const { getByText, queryByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);

    await waitFor(() => {
      expect(getByText('Alice')).toBeTruthy();
      expect(getByText('Bob')).toBeTruthy();
    });

    // Filter by Admin role
    fireEvent.press(getByText('Admin'));

    await waitFor(() => {
      expect(getByText('Alice')).toBeTruthy();
      expect(queryByText('Bob')).toBeNull();
    });

    // Filter by Manager role
    fireEvent.press(getByText('Manager'));

    await waitFor(() => {
      expect(getByText('Bob')).toBeTruthy();
      expect(queryByText('Alice')).toBeNull();
    });
  });

  it('opens delete confirmation and deletes user', async () => {
    const { getByText, queryByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);
    await waitFor(() => getByText('Alice'));

    fireEvent.press(getByText('Alice')); // open delete for Alice
    
    const deleteButton = getByText('Delete User');
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(LocalStorage.deleteUser).toHaveBeenCalledWith('1');
    });
  });

  it('navigates to AddUser screen on fab press', async () => {
    const mockNavigate = jest.fn();
    const { getByText } = render(<HomeScreen navigation={{ navigate: mockNavigate }} route={{}} />);
    fireEvent.press(getByText('+'));
    expect(mockNavigate).toHaveBeenCalledWith('AddUser');
  });

  it('shows loading indicator when loading', () => {
    (useQuery as unknown as jest.Mock).mockReturnValue({ loading: true, error: undefined, data: undefined });
    const { getByTestId } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('displays error message when query returns error', () => {
    (useQuery as unknown as jest.Mock).mockReturnValue({ loading: false, error: { message: 'Network Error' } });
    const { getByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);
    expect(getByText(/error loading customers/i)).toBeTruthy();
  });
});
