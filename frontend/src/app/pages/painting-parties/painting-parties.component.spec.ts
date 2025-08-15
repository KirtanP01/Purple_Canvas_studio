import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PaintingPartiesComponent } from './painting-parties.component';

describe('PaintingPartiesComponent', () => {
  let component: PaintingPartiesComponent;
  let fixture: ComponentFixture<PaintingPartiesComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PaintingPartiesComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaintingPartiesComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should log message when onBookNow is called', () => {
    spyOn(console, 'log');
    component.onBookNow();
    expect(console.log).toHaveBeenCalledWith('Book Now clicked');
  });

  it('should log message when onLearnMore is called', () => {
    spyOn(console, 'log');
    component.onLearnMore('basic');
    expect(console.log).toHaveBeenCalledWith('Learn More clicked for:', 'basic');
  });

  it('should log message when onSignUp is called', () => {
    spyOn(console, 'log');
    component.onSignUp();
    expect(console.log).toHaveBeenCalledWith('Sign Up clicked');
  });
});
