import { StyleSheet } from 'react-native';
import Colors from './colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  section: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: Colors.text.dark,
    lineHeight: 24,
  },
  card: {
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: Colors.primary.green,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.ui.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: Colors.background.light,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.ui.border,
    marginVertical: 16,
  },
});

export const patterns = {
  geometric: {
    backgroundColor: Colors.background.pattern,
    backgroundImage: 'linear-gradient(135deg, rgba(13, 104, 50, 0.1) 25%, transparent 25%, transparent 50%, rgba(13, 104, 50, 0.1) 50%, rgba(13, 104, 50, 0.1) 75%, transparent 75%, transparent)',
    backgroundSize: '20px 20px',
  }
};