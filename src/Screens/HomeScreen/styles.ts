import { StyleSheet, TextStyle, ViewStyle } from "react-native";

interface CustomerListScreenStyles {
  container: ViewStyle;
  header: ViewStyle;
  tabs: ViewStyle;
  tab: ViewStyle;
  tabActive: ViewStyle;
  tabText: TextStyle;
  tabTextActive: TextStyle;
  searchBtn: ViewStyle;
  sectionHeader: ViewStyle;
  sectionHeaderText: TextStyle;
  row: ViewStyle;
  avatar: ViewStyle;
  avatarLetter: TextStyle;
  name: TextStyle;
  role: TextStyle;
  fab: ViewStyle;
  fabText: TextStyle;
  createBtn: ViewStyle;
  createBtnText: TextStyle;
}

const styles = StyleSheet.create<CustomerListScreenStyles>({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
  },
  header: {
    marginTop: 25,
    marginBottom: 4,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F7FAFC',
    width: '80%',
    borderRadius: 24,
  },
  tab: {
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: '#F7FAFC',
    width: '33.3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    borderColor: '#458BE7',
    borderWidth: 1,
    backgroundColor: '#EDF6FF',
  },
  tabText: {
    fontSize: 15,
    color: '#7D8EA8',
  },
  tabTextActive: {
    color: '#458BE7',
  },
  searchBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  sectionHeader: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 12,
  },
  sectionHeaderText: {
    color: '#7D8EA8',
    fontWeight: '500',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#EDF1F5',
    borderBottomWidth: 1,
    zIndex:100
  },
  avatar: {
    height: 34,
    width: 34,
    backgroundColor: '#E8F1FB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarLetter: {
    color: '#458BE7',
    fontWeight: 'bold',
    fontSize: 19,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#1D2226',
  },
  role: {
    color: '#AAB8C2',
    fontSize: 14,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#1D75F9',
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -4,
  },
    createBtn: {
    marginTop: 'auto',
    backgroundColor: '#0176d3',
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 10,
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#1976d2",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 2,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.6,
    paddingVertical: 5,
  },
});

export default styles;
