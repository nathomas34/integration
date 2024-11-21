import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from './Form';

// Mock de la fonction de soumission pour validation
const mockOnSubmit = jest.fn();

describe('Form Component', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
    render(<Form onSubmit={mockOnSubmit} />);
  });

  test('renders all form fields and the submit button', () => {
    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date de naissance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Code postal/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sauvegarder/i })).toBeInTheDocument();
  });

  test('disables submit button when fields are empty', () => {
    const submitButton = screen.getByRole('button', { name: /Sauvegarder/i });
    expect(submitButton).toBeDisabled();
  });

  test('shows error messages for invalid inputs', () => {
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Code postal/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Date de naissance/i), { target: { value: '2020-01-01' } });

    fireEvent.blur(screen.getByLabelText(/Email/i));
    fireEvent.blur(screen.getByLabelText(/Code postal/i));
    fireEvent.blur(screen.getByLabelText(/Date de naissance/i));

    expect(screen.getByText(/Adresse email invalide/i)).toBeInTheDocument();
    expect(screen.getByText(/Code postal invalide/i)).toBeInTheDocument();
    expect(screen.getByText(/Vous devez avoir au moins 18 ans/i)).toBeInTheDocument();
  });

  test('enables submit button when all fields are valid', () => {
    fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByLabelText(/Prénom/i), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jean.dupont@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/Date de naissance/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Ville/i), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByLabelText(/Code postal/i), { target: { value: '75001' } });

    const submitButton = screen.getByRole('button', { name: /Sauvegarder/i });
    expect(submitButton).not.toBeDisabled();
  });

  test('calls onSubmit with correct data when form is submitted', () => {
    fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByLabelText(/Prénom/i), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jean.dupont@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/Date de naissance/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Ville/i), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByLabelText(/Code postal/i), { target: { value: '75001' } });

    const submitButton = screen.getByRole('button', { name: /Sauvegarder/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@gmail.com',
      dateNaissance: '2000-01-01',
      ville: 'Paris',
      codePostal: '75001',
    });
  });

  test('clears the form fields after successful submission', () => {
    fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByLabelText(/Prénom/i), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jean.dupont@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/Date de naissance/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Ville/i), { target: { value: 'Paris' } });
    fireEvent.change(screen.getByLabelText(/Code postal/i), { target: { value: '75001' } });

    const submitButton = screen.getByRole('button', { name: /Sauvegarder/i });
    fireEvent.click(submitButton);

    expect(screen.getByLabelText(/Nom/i).value).toBe('');
    expect(screen.getByLabelText(/Prénom/i).value).toBe('');
    expect(screen.getByLabelText(/Email/i).value).toBe('');
    expect(screen.getByLabelText(/Date de naissance/i).value).toBe('');
    expect(screen.getByLabelText(/Ville/i).value).toBe('');
    expect(screen.getByLabelText(/Code postal/i).value).toBe('');
  });
});
