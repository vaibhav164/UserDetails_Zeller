import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import { LIST_ZELLER_CUSTOMERS } from '../../GraphQL/queries';
import { ListZellerCustomersData } from '../../Components/types';
import { useQuery } from '@apollo/client/react';
import Icon from 'react-native-vector-icons/EvilIcons';

interface Customer {
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
  const [selectedRole, setSelectedRole] = useState<RoleType>('All');
  const [filteredCustomers, setfilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (selectedRole === 'All') {
      setfilteredCustomers(
        (data?.listZellerCustomers?.items ?? [])
          .filter((c): c is Customer => !!c && typeof c.id === 'string' && typeof c.name === 'string' && !!c.role)
          .map((customer: any) => ({
            id: customer.id,
            name: customer.name as string,
            role: customer.role as 'Admin' | 'Manager',
          }))
      );
    } else {
      setfilteredCustomers(
        (data?.listZellerCustomers?.items ?? [])
          .filter(
            (customer: any): customer is Customer =>
              !!customer &&
              typeof customer.id === 'string' &&
              typeof customer.name === 'string' &&
              !!customer.role &&
              customer.role === selectedRole
          )
          .map((customer: any) => ({
            id: customer.id,
            name: customer.name as string,
            role: customer.role as 'Admin' | 'Manager',
          }))
      );
    }
  }, [selectedRole, data]);

  const mappedCustomers: Customer[] = useMemo(() => {
    return (filteredCustomers ?? [])
      .filter((c): c is { id: string; name: string; role: 'Admin' | 'Manager' } => !!c && typeof c.id === 'string' && typeof c.name === 'string' && !!c.role)
      .map((c) => ({
        id: c.id,
        name: c.name as string,
        role: c.role as 'Admin' | 'Manager',
      }));
  }, [filteredCustomers]);

  const sections = useMemo(() => groupByLetter(mappedCustomers), [mappedCustomers]);

  return (
    <SafeAreaView style={{ flex: 1}}>
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
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarLetter}>{item.name[0].toUpperCase()}</Text>
                </View>
                <Text style={styles.name}>{item.name}</Text>
                {item.role === 'Admin' && <Text style={styles.role}>Admin</Text>}
              </View>
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
