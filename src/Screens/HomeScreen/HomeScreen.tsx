import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import styles from './styles';
import { LIST_ZELLER_CUSTOMERS } from '../../GraphQL/queries';
import { ListZellerCustomersData } from '../../Components/types';
import { useQuery } from '@apollo/client/react';
import Icon from 'react-native-vector-icons/EvilIcons';
import { createTables, getDBConnection, getUsers, saveUsers } from '../../LocalDB/LocalDB';
import { useFocusEffect } from '@react-navigation/native';
import { deleteUser } from '../../LocalDB/LocalStograge';
export interface Customer {
  id: string;
  name: string;
  role: 'Admin' | 'Manager';
}

interface CustomerSection {
  title: string;
  data: Customer[];
}

interface CustomerListScreenProps {}

const ROLES = ['All', 'Admin', 'Manager'] as const;
type RoleType = typeof ROLES[number];

function groupByLetter(customers: Customer[]): CustomerSection[] {
  const grouped: Record<string, Customer[]> = {};
  customers.forEach((c) => {
    const letter = c.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(c);
  });
  return Object.keys(grouped)
    .sort()
    .map((letter) => ({
      title: letter,
      data: grouped[letter].sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

const HomeScreen: React.FC<CustomerListScreenProps> = ({ navigation }) => {
  const { loading, error, data } = useQuery<ListZellerCustomersData>(LIST_ZELLER_CUSTOMERS)
  const [localUsers, setLocalUsers] = useState<Customer[]>([]);
  const [loadingLocalUsers, setLoadingLocalUsers] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'All' | 'Admin' | 'Manager'>('All');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useFocusEffect(
  React.useCallback(() => {
    async function loadLocalUsers() {
      const db = await getDBConnection();
      await createTables(db);

      // Optionally sync remote data if needed
      if (data?.listZellerCustomers?.items?.length) {
        const usersToSave: Customer[] = data.listZellerCustomers.items
          .filter(c => c && c.id && c.name && c.role)
          .map(c => ({
            id: c!.id,
            name: c!.name,
            role: c!.role as 'Admin' | 'Manager',
          }));
        await saveUsers(db, usersToSave);
      }

      const storedUsers = await getUsers(db);
      setLocalUsers(storedUsers);
      setLoadingLocalUsers(false);
    }

    loadLocalUsers().catch(console.error);
    return () => {};
  }, [data])
);


  useEffect(() => {
    if (selectedRole === 'All') {
      setFilteredCustomers(localUsers);
    } else {
      setFilteredCustomers(localUsers.filter(user => user.role === selectedRole.toUpperCase()));
    }
  }, [localUsers, selectedRole]);

  const mappedCustomers: Customer[] = useMemo(() => {
    return (filteredCustomers ?? [])
      .filter((c): c is { id: string; name: string; role: 'Admin' | 'Manager' } => !!c && typeof c.id === 'string' && typeof c.name === 'string' && !!c.role)
      .map((c) => ({
        id: c.id,
        name: c.name as string,
        role: c.role as 'Admin' | 'Manager',
      }));
  }, [filteredCustomers]);



  const sections = useMemo(() => groupByLetter(mappedCustomers), [filteredCustomers]);

  function handleDeleteUser(user: Customer) {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', onPress: () => setUserToDelete(null), style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            const db = await getDBConnection();
            await deleteUser(db, user.id);
            const storedUsers = await getUsers(db);
            setLocalUsers(storedUsers);
            setUserToDelete(null);
          },
        },
      ]
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error loading customers: {error.message}</Text>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.tabs}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[styles.tab, selectedRole === role && styles.tabActive]}
                  onPress={() => setSelectedRole(role)}
                >
                  <Text style={[styles.tabText, selectedRole === role && styles.tabTextActive]}>{role}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.searchBtn}>
              <Icon name="search" size={25} color="#1a08ebff" />
            </TouchableOpacity>
          </View>
          <SectionList<Customer, CustomerSection>
            sections={sections}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <>
              <Pressable style={styles.row} onPress={() => { userToDelete && userToDelete.length > 0 ? setUserToDelete("") : setUserToDelete(item.id) }}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarLetter}>{item.name[0].toUpperCase()}</Text>
                </View>
                <Text style={styles.name}>{item.name}</Text>
                {item.role === 'Admin' && <Text style={styles.role}>Admin</Text>}
              </Pressable>
                     {userToDelete === item.id && <TouchableOpacity
                        style={styles.createBtn}
                        onPress={()=>handleDeleteUser(item)}
                        testID="createUserBtn"
                      >
                        <Text style={styles.createBtnText}>Delete User</Text>
                      </TouchableOpacity>}
              </>
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
          <TouchableOpacity style={styles.fab} onPress={()=>{
            navigation.navigate("AddUser")
          }}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};



export default HomeScreen;
