import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { ResponseHelper } from 'src/utils/response.helper';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
  ) {}

  // Crear un proyecto
  async createProject(name: string, description: string, ownerId: number, collaboratorIds: number[] = []) {
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const collaborators = await this.userRepository.findByIds(collaboratorIds);
    const project = this.projectRepository.create({ name, description, owner, collaborators });
    return this.projectRepository.save(project);
  }

  //Obtener proyectos de un usuario (como propietario o colaborador)
  async getUserProjects(userId: number) {
    // Obtener proyectos donde el usuario es propietario
    const ownedProjects = await this.projectRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner', 'collaborators'],
    });

    // Marcar los proyectos como "owner"
    const projectsWithRoles = ownedProjects.map((project) => ({
      ...project,
      role: 'owner', // Este usuario es el propietario
    }));

    // Obtener proyectos donde el usuario es colaborador
    const collaboratingProjects = await this.projectRepository.find({
      relations: ['owner', 'collaborators'],
    });

    // Filtrar proyectos donde el usuario es colaborador
    const filteredCollaboratingProjects = collaboratingProjects
      .filter((project) =>
        project.collaborators.some((collaborator) => collaborator.id === userId)
      )
      .map((project) => ({
        ...project,
        role: 'collaborator', // Este usuario es colaborador
      }));

    // Combinar ambos arrays y eliminar duplicados
    const projectMap = new Map<number, any>();

    // Agregar proyectos como "owner" al map
    projectsWithRoles.forEach((project) => {
      projectMap.set(project.id, project);
    });

    // Agregar proyectos como "collaborator" al map, si no existen
    filteredCollaboratingProjects.forEach((project) => {
      if (!projectMap.has(project.id)) {
        projectMap.set(project.id, project);
      }
    });

    // Convertir el map a un array
    const allProjects = Array.from(projectMap.values());

    // Retornar todos los proyectos con los roles correspondientes
    return ResponseHelper.success('Projects retrieved successfully', allProjects);
  }

  // Agregar colaboradores a un proyecto
  async addCollaborators(projectId: number, collaboratorIds: number[], userId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner', 'collaborators'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.owner.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this project');
    }

    const newCollaborators = await this.userRepository.findByIds(collaboratorIds);
    project.collaborators = [...project.collaborators, ...newCollaborators];
    return this.projectRepository.save(project);
  }

  getProject(projectId: number) {
    return this.projectRepository.findOne({
      where: { id: projectId, deleted_at: null },
      relations: ['owner', 'collaborators'],
    });
  }

  async updateProject(
    projectId: number, name: string,
    description: string, collaboratorIds: number[],userId: number,
  ) {
    // Buscar el proyecto con sus relaciones
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['owner', 'collaborators'],
    });
  
    // Validar si el proyecto existe
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  
    // Verificar que el usuario autenticado es el propietario del proyecto
    if (project.owner.id !== userId) {
      throw new UnauthorizedException('You are not the owner of this project');
    }
  
    // Actualizar los datos básicos del proyecto
    project.name = name;
    project.description = description;
  
    // Buscar los nuevos colaboradores
    const collaborators = await this.userRepository.findByIds(collaboratorIds);
  
    // Actualizar los colaboradores del proyecto
    project.collaborators = collaborators;
  
    // Guardar los cambios en la base de datos
    return this.projectRepository.save(project);
  }

  async softDeleteProject(projectId: number) {
    await this.projectRepository.softDelete({ id: projectId });
    const all_projects = await this.projectRepository.findOne({
      where: { id: projectId, deleted_at: null },
      relations: ['owner', 'collaborators'],
    });
    return ResponseHelper.success('Project deleted successfully', all_projects);
  }
  
}