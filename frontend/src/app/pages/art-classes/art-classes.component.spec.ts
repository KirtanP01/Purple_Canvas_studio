import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ArtClassesComponent } from './art-classes.component';

describe('ArtClassesComponent', () => {
  let component: ArtClassesComponent;
  let fixture: ComponentFixture<ArtClassesComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ArtClassesComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtClassesComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to enrollment when navigateToEnrollment is called', () => {
    spyOn(console, 'log');
    component.navigateToEnrollment();
    expect(console.log).toHaveBeenCalledWith('Enroll Now clicked');
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
});
