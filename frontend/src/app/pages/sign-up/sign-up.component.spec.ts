import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form data with empty values', () => {
    expect(component.formData.name).toBe('');
    expect(component.formData.email).toBe('');
    expect(component.formData.phone).toBe('');
    expect(component.formData.date).toBe('');
    expect(component.formData.numberOfGuests).toBe(1);
    expect(component.formData.package).toBe('');
    expect(component.formData.theme).toBe('');
    expect(component.formData.additionalNotes).toBe('');
  });

  it('should have packages and themes arrays populated', () => {
    expect(component.packages.length).toBeGreaterThan(0);
    expect(component.themes.length).toBeGreaterThan(0);
  });

  it('should navigate to home when navigateToHome is called', () => {
    component.navigateToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to about when navigateToAbout is called', () => {
    component.navigateToAbout();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/about']);
  });

  it('should navigate to contact when navigateToContact is called', () => {
    component.navigateToContact();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/contact']);
  });

  it('should navigate to activities when navigateToActivities is called', () => {
    component.navigateToActivities();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/art-classes']);
  });

  it('should reset form data after successful submission', () => {
    // Fill out form data
    component.formData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      date: '2024-01-01',
      numberOfGuests: 5,
      package: 'basic',
      theme: 'abstract',
      additionalNotes: 'Test notes'
    };

    spyOn(window, 'alert');
    component.onSubmitBooking();

    // Check that form was reset
    expect(component.formData.name).toBe('');
    expect(component.formData.email).toBe('');
    expect(component.formData.phone).toBe('');
    expect(component.formData.date).toBe('');
    expect(component.formData.numberOfGuests).toBe(1);
    expect(component.formData.package).toBe('');
    expect(component.formData.theme).toBe('');
    expect(component.formData.additionalNotes).toBe('');
  });

  it('should show alert when required fields are missing', () => {
    spyOn(window, 'alert');
    component.onSubmitBooking();
    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields.');
  });
});
